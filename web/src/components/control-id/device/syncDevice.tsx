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
  createUserCommand,
  createUserGroupRelationCommand,
  setUserFaceCommand,
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
import { getBase64Photo } from "@/components/member/getBase64Photo";
import { getVisitorBase64Photo } from "@/components/visitor/getBase64Photo";

const FormSchema = z.object({
  timeZone: z.boolean(),
  timeSpan: z.boolean(),
  accessRules: z.boolean(),
  groups: z.boolean(),
  members: z.boolean(),
  visitors: z.boolean(),
  memberGroups: z.boolean(),
  visitorGroups: z.boolean(),
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
      members: true,
      visitors: true,
      memberGroups: true,
      visitorGroups: true,
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
            const response = await api.get(`timeZone/lobby/${lobby}`, {
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
            const response = await api.get(`timeSpan/lobby/${lobby}`, {
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
            const response = await api.get(`accessRule/lobby/${lobby}`, {
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
            const response = await api.get(`group/lobby/${lobby}`, {
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

        if (data.members) {
          let members = [];
          try {
            const response = await api.get(`member/lobby/${lobby}`, {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            members = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }

          if (members.length > 0) {
            for (const member of members) {
              const base64: string = await getBase64Photo(session, member.memberId); // get user photo (base64)
              const timestamp = ~~(Date.now() / 1000);

              console.log("Adicionando membro ao dispositivo...");

              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createUserCommand(
                  member.memberId,
                  member.name,
                  member?.cpf || member?.rg
                )
              );

              await api.post(
                `/control-id/add-command?id=${device.name}`,
                setUserFaceCommand(member.memberId, base64, timestamp)
              );
            }
          }
        }

        if (data.visitors) {
          let visitors = [];
          try {
            const response = await api.get(`visitor/lobby/${lobby}`, {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            visitors = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }

          if (visitors.length > 0) {
            for (const visitor of visitors) {
              const base64: string = await getVisitorBase64Photo(session, visitor.visitorId); // get user photo (base64)
              const timestamp = ~~(Date.now() / 1000);

              console.log("Adicionando visitante ao dispositivo...");

              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createUserCommand(
                  visitor.visitorId + 10000,
                  visitor.name,
                  visitor?.cpf || visitor?.rg,
                  1 // visitor flag
                )
              );

              await api.post(
                `/control-id/add-command?id=${device.name}`,
                setUserFaceCommand(visitor.visitorId + 10000, base64, timestamp)
              );
            }
          }
        }

        if (data.visitorGroups) {
          let visitorGroups = [];

          try {
            const response = await api.get(`visitorGroup/lobby/${lobby}`, {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            });
            visitorGroups = response.data;
          } catch (error) {
            console.error("Erro ao obter dados:", error);
          }

          console.log("Adicionando a relação de visitantes x grupos ao dispositivo...");

          if (visitorGroups.length > 0) {
            for (const visitorGroup of visitorGroups) {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createUserGroupRelationCommand(
                  visitorGroup.visitorId + 10000,
                  visitorGroup.groupId
                )
              );
            }
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

          console.log("Adicionando a relação de membros x grupos ao dispositivo...");

          if (memberGroups.length > 0) {
            for (const memberGroup of memberGroups) {
              await api.post(
                `/control-id/add-command?id=${device.name}`,
                createUserGroupRelationCommand(
                  memberGroup.memberId,
                  memberGroup.groupId
                )
              );
            }
          }
        }

        if (data.groupAccessRules) {
          // Enviar groupAccessRules para o dispositivo
          let groupAccessRules = [];
          try {
            const response = await api.get(`groupAccessRule/lobby/${lobby}`, {
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

        if (data.accessRuleTimeZones) {
          // Enviar AccessRuleTimeZones para o dispositivo
          let accessRuleTimeZones = [];
          try {
            const response = await api.get(`accessRuleTimeZone/lobby/${lobby}`, {
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


        toast.success("Dados enviados!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro");
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
              <CheckboxItem
                control={form.control}
                name="members"
                label="Membros"
              />
              <CheckboxItem
                control={form.control}
                name="visitors"
                label="Visitantes"
              />

              {/* <CheckboxItem control={form.control} name="areas" label="Áreas" /> */}
              <CheckboxItem
                control={form.control}
                name="groupAccessRules"
                label="Grupos x Regras de acesso"
              />
              <CheckboxItem
                control={form.control}
                name="accessRuleTimeZones"
                label="Regras de acesso x Horários"
              />
              <CheckboxItem
                control={form.control}
                name="memberGroups"
                label="Membros x Grupos"
              />
              <CheckboxItem
                control={form.control}
                name="visitorGroups"
                label="Visitantes x Grupos"
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
