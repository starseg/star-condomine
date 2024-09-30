"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { CheckboxItem, InputItem } from "@/components/form-item";
import { useSession } from "next-auth/react";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import DefaultCombobox from "@/components/form/comboboxDefault";
import {
  createAccessRuleCommand,
  createAccessRuleTimeZoneRelationCommand,
  createAreaAccessRuleRelationCommand,
  createAreaCommand,
  createGroupAccessRuleRelationCommand,
  createGroupCommand,
  createPortalAccessRuleRelationCommand,
  createTimeSpanCommand,
  createTimeZoneCommand,
  createUserGroupRelationCommand,
} from "./commands";
import { CleanDevice } from "./cleanDevice";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  timeZone: z.boolean(),
  timeSpan: z.boolean(),
  accessRules: z.boolean(),
  groups: z.boolean(),
  memberGroups: z.boolean(),
  groupAccessRules: z.boolean(),
  areaAccessRules: z.boolean(),
  accessRuleTimeZones: z.boolean(),
});

export default function SyncDevice() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeZone: true,
      timeSpan: true,
      accessRules: true,
      groups: true,
      memberGroups: true,
      groupAccessRules: true,
      areaAccessRules: true,
      accessRuleTimeZones: true,
    },
  });
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [serialId, setSerialId] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const device = devices.find((device) => device.name === serialId);
      if (device) {
        if (data.timeZone) {
          // Enviar TimeZones para o dispositivo
          let timeZones = [];
          try {
            const response = await api.get("timeZone", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            timeZones = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (timeZones.length > 0) {
            timeZones.map(async (timeZone: TimeZone) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createTimeZoneCommand(timeZone.timeZoneId, timeZone.name)
              );
            });
          }
        }
        if (data.timeSpan) {
          // Enviar TimeSpans para o dispositivo
          let timeSpans = [];
          try {
            const response = await api.get("timeSpan", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            timeSpans = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (timeSpans.length > 0) {
            timeSpans.map(async (timeSpan: TimeSpan) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createTimeSpanCommand(
                  timeSpan.timeSpanId,
                  timeSpan.timeZoneId,
                  timeSpan.start,
                  timeSpan.end,
                  timeSpan.sun,
                  timeSpan.mon,
                  timeSpan.tue,
                  timeSpan.wed,
                  timeSpan.thu,
                  timeSpan.fri,
                  timeSpan.sat,
                  timeSpan.hol1,
                  timeSpan.hol2,
                  timeSpan.hol3
                )
              );
            });
          }
        }
        if (data.accessRules) {
          // Enviar accessRules para o dispositivo
          let accessRules = [];
          try {
            const response = await api.get("accessRule", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            accessRules = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (accessRules.length > 0) {
            accessRules.map(async (accessRule: AccessRule) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createAccessRuleCommand(
                  accessRule.accessRuleId,
                  accessRule.name,
                  accessRule.type,
                  accessRule.priority
                )
              );
              // relaciona a regra de acesso com a área padrão
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createPortalAccessRuleRelationCommand(
                  1,
                  accessRule.accessRuleId
                )
              );
            });
          }
        }
        if (data.groups) {
          // Enviar groups para o dispositivo
          let groups = [];
          try {
            const response = await api.get("group", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            groups = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (groups.length > 0) {
            groups.map(async (group: Group) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createGroupCommand(group.groupId, group.name)
              );
            });
          }
        }
        if (data.memberGroups) {
          let memberGroups = [];
          try {
            const response = await api.get(`memberGroup/lobby/${lobby}`, {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            memberGroups = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          // Enviar membros do grupo para o dispositivo
          if (memberGroups.length > 0) {
            memberGroups.map(async (memberGroup: MemberGroup) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createUserGroupRelationCommand(
                  memberGroup.memberId,
                  memberGroup.groupId
                )
              );
            });
          }
        }
        if (data.groupAccessRules) {
          // Enviar groupAccessRules para o dispositivo
          let groupAccessRules = [];
          try {
            const response = await api.get("groupAccessRule", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            groupAccessRules = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (groupAccessRules.length > 0) {
            groupAccessRules.map(async (groupAccessRule: GroupAccessRule) => {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createGroupAccessRuleRelationCommand(
                  groupAccessRule.groupId,
                  groupAccessRule.accessRuleId
                )
              );
            });
          }
        }
        if (data.areaAccessRules) {
          // Enviar areaAccessRules para o dispositivo
          let areaAccessRules = [];
          try {
            const response = await api.get("areaAccessRule", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            areaAccessRules = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (areaAccessRules.length > 0) {
            areaAccessRules.map(async (areaAccessRule: AreaAccessRule) => {
              if (areaAccessRule.areaId === device.lobbyId) {
                await api.post(
                  `/control-id/add-command?id=${device.name}`,
                  createAreaAccessRuleRelationCommand(
                    areaAccessRule.areaId,
                    areaAccessRule.accessRuleId
                  )
                );
              }
            });
          }
        }
        if (data.accessRuleTimeZones) {
          // Enviar AccessRuleTimeZones para o dispositivo
          let accessRuleTimeZones = [];
          try {
            const response = await api.get("accessRuleTimeZone", {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            accessRuleTimeZones = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }
          if (accessRuleTimeZones.length > 0) {
            accessRuleTimeZones.map(
              async (AccessRuleTimeZone: AccessRuleTimeZone) => {
                await api.post(
                  `/control-id/add-command?id=${device.name}`,
                  createAccessRuleTimeZoneRelationCommand(
                    AccessRuleTimeZone.accessRuleId,
                    AccessRuleTimeZone.timeZoneId
                  )
                );
              }
            );
          }
        }
        toast.success("Dados enviados!", { theme: "colored" });
      }
    } catch (error) {
      toast.error("Ocorreu um erro", { theme: "colored" });
      console.error("Erro:", error);
      throw error;
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <ArrowsClockwise size={22} className="mr-2" /> Sincronizar dispositivo
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"}>
        <SheetHeader className="mx-auto w-full max-w-lg">
          <SheetTitle>Sincronizar dispositivo</SheetTitle>
          <SheetDescription>Envie dados para um dispositivo.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 mx-auto mt-4 w-full max-w-lg"
          >
            {/* <DefaultCombobox
              control={form.control}
              name="device"
              label="Dispositivo"
              object={items}
              selectLabel="Selecione o dispositivo"
              searchLabel="Buscar dispositivo..."
              onSelect={(value: number) => {
                form.setValue("device", value);
              }}
            /> */}
            <Select value={serialId} onValueChange={setSerialId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.name}>
                      {device.ip} - {device.description} - {device.lobby.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-4 py-2">
              <p className="text-sm">Enviar dados de:</p>
              <CheckboxItem
                control={form.control}
                name="timeZone"
                label="Horários"
              />
              <CheckboxItem
                control={form.control}
                name="timeSpan"
                label="Intervalos"
              />
              <CheckboxItem
                control={form.control}
                name="accessRules"
                label="Regras de acesso"
              />
              <CheckboxItem
                control={form.control}
                name="groups"
                label="Grupos"
              />
              {/* <CheckboxItem control={form.control} name="areas" label="Áreas" /> */}
              <CheckboxItem
                control={form.control}
                name="groupAccessRules"
                label="Grupos x Regras de acesso"
              />
              <CheckboxItem
                control={form.control}
                name="memberGroups"
                label="Membros x Grupos"
              />
              <CheckboxItem
                control={form.control}
                name="accessRuleTimeZones"
                label="Regras de acesso x Horários"
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </SheetClose>
              <CleanDevice devices={devices} />
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
