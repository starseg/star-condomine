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
import { PencilLine } from "@phosphor-icons/react/dist/ssr";
import DefaultCombobox from "@/components/form/comboboxDefault";
import { useEffect, useState } from "react";

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
  useEffect(() => {
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
        <Button className="aspect-square p-0" variant={"ghost"}>
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
            className="w-full space-y-2"
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
            <div className="flex items-end justify-center gap-2">
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
            <div className="flex items-end justify-center gap-2">
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
