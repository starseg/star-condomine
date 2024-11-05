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
import { FilePlus2Icon } from "lucide-react";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { CheckboxItem, InputItem } from "@/components/form-item";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DefaultCombobox from "@/components/form/comboboxDefault";
import { useSearchParams } from "next/navigation";

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

export default function TimeSpanForm() {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time_zone_id: 0,
      start_hour: "0",
      start_min: "0",
      end_hour: "0",
      end_min: "0",
      sun: true,
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      hol1: true,
      hol2: true,
      hol3: true,
    },
  });
  const { data: session } = useSession();
  const { update } = useControliDUpdate();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

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
  }, [session, update]);

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
        timeZoneId: data.time_zone_id,
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
        lobbyId: lobby,
      };

      const response = await api.post(`timeSpan`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Intervalo registrado!", {
          theme: "colored",
        });
        form.reset({
          time_zone_id: 0,
          start_hour: "0",
          start_min: "0",
          end_hour: "0",
          end_min: "0",
          sun: true,
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: true,
          hol1: true,
          hol2: true,
          hol3: true,
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
        <Button className="flex gap-2">
          <FilePlus2Icon /> Criar intervalo
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Criar intervalo</SheetTitle>
          <SheetDescription>Cadastre aqui um novo intervalo.</SheetDescription>
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
