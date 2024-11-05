"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultInput from "../form/inputDefault";
import RadioInput from "../form/inputRadio";
import DefaultTextarea from "../form/textareaDefault";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const FormSchema = z.object({
  visitor: z.number(),
  member: z.number(),
  reason: z.string(),
  location: z.string(),
  comments: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface Values {
  startDate: Date | undefined;
  endDate: Date | undefined;
  location: string;
  reason: string;
  comments: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  member: number;
  visitor: number;
}

export function SchedulingUpdateForm({
  preloadedValues,
}: {
  preloadedValues: Values;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  interface Visitor {
    visitorId: number;
    name: string;
  }
  interface Member {
    memberId: number;
    name: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [visitors, setVisitors] = useState([]);
  const fetchVisitors = async () => {
    if (session)
      try {
        const response = await api.get("visitor/lobby/" + params.get("lobby"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setVisitors(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [members, setMembers] = useState([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get("member/lobby/" + params.get("lobby"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setMembers(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchVisitors();
    fetchMembers();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }

  let visitorItems: item[] = [];
  visitors.map((visitor: Visitor) =>
    visitorItems.push({
      value: visitor.visitorId,
      label: visitor.name,
    })
  );

  let memberItems: item[] = [];
  members.map((member: Member) =>
    memberItems.push({
      value: member.memberId,
      label: member.name,
    })
  );

  const status = [
    {
      value: "ACTIVE",
      label: "Ativo",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
    },
  ];

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;
    const id = params.get("id");

    const info = {
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      status: data.status,
      location: data.location,
      reason: data.reason,
      comments: data.comments,
      memberId: data.member,
      visitorId: data.visitor,
      operatorId: operator,
      lobbyId: lobby,
    };
    try {
      await api.put("scheduling/" + id, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <DefaultCombobox
          control={form.control}
          name="visitor"
          label="Visitante"
          object={visitorItems}
          selectLabel="Selecione o visitante que está acessando"
          searchLabel="Buscar visitante..."
          onSelect={(value: number) => {
            form.setValue("visitor", value);
          }}
        />

        <DefaultCombobox
          control={form.control}
          name="member"
          label="Morador visitado / colaborador acionado"
          object={memberItems}
          selectLabel="Selecione quem está sendo visitado"
          searchLabel="Buscar pessoa..."
          onSelect={(value: number) => {
            form.setValue("member", value);
          }}
        />

        <DefaultInput
          control={form.control}
          name="reason"
          label="Motivo"
          placeholder="Por que está sendo feita essa visita?"
        />

        <DefaultInput
          control={form.control}
          name="location"
          label="Local da visita"
          placeholder="Para onde está indo? Casa, Salão de Festas..."
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Validade do acesso</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Data de início</span>
                        )}
                        <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      locale={ptBR}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-transparent">a</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Data de fim</span>
                        )}
                        <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="space-y-2 p-2 w-auto"
                    align="start"
                  >
                    <Select
                      onValueChange={(value) =>
                        form.setValue(
                          "endDate",
                          addDays(new Date(), parseInt(value))
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="1">Amanhã</SelectItem>
                        <SelectItem value="7">Em uma semana</SelectItem>
                        <SelectItem value="30">Em um mês</SelectItem>
                        <SelectItem value="365">Em um ano</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="border rounded-md">
                      <Calendar
                        locale={ptBR}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <RadioInput
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />
        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
