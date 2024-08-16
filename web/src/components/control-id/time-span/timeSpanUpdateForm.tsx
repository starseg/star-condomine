"use client";
import { CheckboxItem, InputItem } from "@/components/form-item";
import DefaultCombobox from "@/components/form/comboboxDefault";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { modifyObjectCommand } from "../device/commands";

const FormSchema = z.object({
  time_zone_id: z.number(),
  start_hour: z.string(),
  start_min: z.string(),
  end_hour: z.string(),
  end_min: z.string(),
  sun: z.boolean(),
  mon: z.boolean(),
  tue: z.boolean(),
  wed: z.boolean(),
  thu: z.boolean(),
  fri: z.boolean(),
  sat: z.boolean(),
  hol1: z.boolean(),
  hol2: z.boolean(),
  hol3: z.boolean(),

  synchronize: z.boolean(),
});

export default function TimeSpanUpdateForm({
  id,
  time_zone_id,
  start_hour,
  start_min,
  end_hour,
  end_min,
  sun,
  mon,
  tue,
  wed,
  thu,
  fri,
  sat,
  hol1,
  hol2,
  hol3,
  lobby,
}: {
  id: number;
  time_zone_id: number;
  start_hour: string;
  start_min: string;
  end_hour: string;
  end_min: string;
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  hol1: boolean;
  hol2: boolean;
  hol3: boolean;
  lobby: number | null;
}) {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time_zone_id: time_zone_id,
      start_hour: start_hour,
      start_min: start_min,
      end_hour: end_hour,
      end_min: end_min,
      sun: sun,
      mon: mon,
      tue: tue,
      wed: wed,
      thu: thu,
      fri: fri,
      sat: sat,
      hol1: hol1,
      hol2: hol2,
      hol3: hol3,
      synchronize: false,
    },
  });
  const { data: session } = useSession();

  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const fetchTimeZones = async () => {
    if (session)
      try {
        const response = await api.get("timeZone", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setTimeZones(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState("");
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
  const [deviceList, setDeviceList] = useState<string[]>([]);
  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === deviceId);
    if (deviceId !== "" && !isSetDevice)
      setDeviceList((prev) => [...prev, deviceId]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

  useEffect(() => {
    fetchDevices();
    fetchTimeZones();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];

  timeZones.map((timeZone: TimeZone) =>
    items.push({
      value: timeZone.timeZoneId,
      label: timeZone.name,
    })
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // converter tudo em minutos
      const start_time =
        Number(data.start_hour) * 3600 + Number(data.start_min) * 60;

      const end_time = Number(data.end_hour) * 3600 + Number(data.end_min) * 60;

      const info = {
        timeZoneId: Number(data.time_zone_id),
        start: start_time,
        end: end_time,
        sun: data.sun === true ? 1 : 0,
        mon: data.mon === true ? 1 : 0,
        tue: data.tue === true ? 1 : 0,
        wed: data.wed === true ? 1 : 0,
        thu: data.thu === true ? 1 : 0,
        fri: data.fri === true ? 1 : 0,
        sat: data.sat === true ? 1 : 0,
        hol1: data.hol1 === true ? 1 : 0,
        hol2: data.hol2 === true ? 1 : 0,
        hol3: data.hol3 === true ? 1 : 0,
      };

      const response = await api.put(`timeSpan/${id}`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      if (data.synchronize) {
        const { timeZoneId, ...rest } = info;
        const controlIdInfo = {
          ...rest,
          time_zone_id: timeZoneId,
        };
        if (deviceList.length > 0) {
          deviceList.map(async (device) => {
            await api.post(
              `/control-id/add-command?id=${device}`,
              modifyObjectCommand("time_spans", controlIdInfo, {
                time_spans: { id: id },
              })
            );
          });
        }
      }

      if (response.status === 200) {
        toast.success("Intervalo atualizado!", {
          theme: "colored",
        });
        triggerUpdate();
      }
    } catch (error) {
      toast.error("Erro ao registrar", {
        theme: "colored",
      });
      console.error("Erro:", error);
      throw error;
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="p-0 aspect-square" variant={"ghost"}>
          <PencilLine size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Editar intervalo</SheetTitle>
          <SheetDescription>Atualize este intervalo.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <DefaultCombobox
              control={form.control}
              name="time_zone_id"
              label="Tipo"
              object={items}
              selectLabel="Selecione um horário"
              searchLabel="Buscar horário..."
              onSelect={(value: number) => {
                form.setValue("time_zone_id", value);
              }}
            />
            <div className="flex justify-center items-end gap-2">
              <InputItem
                control={form.control}
                type="number"
                name="start_hour"
                label="Hora de início"
                placeholder="00"
              />
              <p className="font-bold text-xl">:</p>
              <InputItem
                control={form.control}
                type="number"
                name="start_min"
                label=""
                placeholder="00"
              />
            </div>
            <div className="flex justify-center items-end gap-2">
              <InputItem
                control={form.control}
                type="number"
                name="end_hour"
                label="Hora de fim"
                placeholder="00"
              />
              <p className="font-bold text-xl">:</p>
              <InputItem
                control={form.control}
                type="number"
                name="end_min"
                label=""
                placeholder="00"
              />
            </div>
            <div className="flex flex-col gap-2 py-2">
              <p className="text-sm">Dias da semana</p>
              <CheckboxItem control={form.control} name="sun" label="Domingo" />
              <CheckboxItem control={form.control} name="mon" label="Segunda" />
              <CheckboxItem control={form.control} name="tue" label="Terça" />
              <CheckboxItem control={form.control} name="wed" label="Quarta" />
              <CheckboxItem control={form.control} name="thu" label="Quinta" />
              <CheckboxItem control={form.control} name="fri" label="Sexta" />
              <CheckboxItem control={form.control} name="sat" label="Sábado" />
            </div>
            <div className="flex flex-col gap-2 py-2">
              <p className="text-sm">Feriados</p>
              <CheckboxItem control={form.control} name="hol1" label="Tipo 1" />
              <CheckboxItem control={form.control} name="hol2" label="Tipo 2" />
              <CheckboxItem control={form.control} name="hol3" label="Tipo 3" />
            </div>

            <CheckboxItem
              control={form.control}
              name="synchronize"
              label="Sincronizar com dispositivos"
            />
            {form.getValues("synchronize") && (
              <>
                <div className="flex gap-2">
                  <Select value={deviceId} onValueChange={setDeviceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um dispositivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {devices.map((device) => (
                          <SelectItem key={device.deviceId} value={device.name}>
                            {device.ip} - {device.name} - {device.description}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={addDevice}
                    className="p-0 text-2xl aspect-square"
                    title="Adicionar"
                  >
                    <PlusCircle />
                  </Button>
                </div>
                <div className="flex gap-2">
                  {deviceList.map((device) => (
                    <p
                      key={device}
                      className="bg-stone-800 hover:bg-stone-950 p-1 border hover:border-red-700 rounded cursor-pointer"
                      onClick={() => removeDeviceFromList(device)}
                    >
                      {device}
                    </p>
                  ))}
                </div>
              </>
            )}
            {/* <SyncItem
              lobby={lobby}
              sendCommand={() =>
                modifyObjectCommand(
                  "time_spans",
                  {
                    time_zone_id: form.getValues("time_zone_id"),
                  },
                  { time_spans: { id: id } }
                )
              }
              triggerLabel="Sincronizar com dispositivos"
            /> */}
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
