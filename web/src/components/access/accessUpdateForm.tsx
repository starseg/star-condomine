"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useSearchParams } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";

const FormSchema = z.object({
  visitor: z.number(),
  member: z.number(),
  reason: z.string(),
  local: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  comments: z.string(),
});

interface Values {
  startTime: string;
  endTime: string;
  local: string;
  reason: string;
  comments: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  member: number;
  visitor: number;
}

export function AccessUpdateForm({
  preloadedValues,
}: {
  preloadedValues: Values;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");

  const [visitors, setVisitors] = useState<Visitor[]>([]);
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

  const [members, setMembers] = useState<Member[]>([]);
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

  const setStringDate = (time: string) => {
    if (time !== "") {
      const dateObject = new Date(time);
      dateObject.setHours(dateObject.getHours() + 3);
      return format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    } else {
      return null;
    }
  };

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;
    const id = params.get("id");

    let accessStatus = "ACTIVE";
    if (data.endTime !== "") accessStatus = "INACTIVE";

    const info = {
      startTime: setStringDate(data.startTime),
      endTime: setStringDate(data.endTime),
      status: accessStatus,
      local: data.local,
      reason: data.reason,
      comments: data.comments,
      memberId: data.member,
      visitorId: data.visitor,
      operatorId: operator,
      lobbyId: lobby,
    };
    try {
      await api.put("access/" + id, info, {
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
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
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
          name="local"
          label="Local da visita"
          placeholder="Para onde está indo? Casa, Salão de Festas..."
        />

        <DefaultInput
          control={form.control}
          name="startTime"
          label="Data e hora do acesso"
          type="datetime-local"
          placeholder="Data e hora"
        />
        {control === "S" ? (
          <DefaultInput
            control={form.control}
            name="endTime"
            label="Data e hora da saída"
            type="datetime-local"
            placeholder="Data e hora"
          />
        ) : (
          ""
        )}

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional. Exemplo: Placa do veículo"
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
