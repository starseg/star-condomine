"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DefaultCheckbox from "../form/checkboxDefault";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";

const FormSchema = z.object({
  visitor: z.number(),
  member: z.number(),
  reason: z.string(),
  local: z.string(),
  startTime: z.string(),
  comments: z.string(),
  currentDate: z.boolean(),
});

export function AccessForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visitor: 0,
      member: 0,
      reason: "",
      local: "",
      startTime: "",
      comments: "",
      currentDate: false,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

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

  interface visitorItem {
    value: number;
    label: string;
    openAccess: boolean;
  }

  interface memberItem {
    value: number;
    label: string;
    addressType: string | null;
    address: string | null;
    comments: string;
  }

  let visitorItems: visitorItem[] = [];
  visitors.map((visitor: Visitor) => {
    if (visitor.status === "ACTIVE") {
      visitorItems.push({
        value: visitor.visitorId,
        label: visitor.name,
        openAccess:
          visitor.access.length > 0 && visitor.lobby.exitControl === "ACTIVE"
            ? true
            : false,
      });
    }
  });

  let memberItems: memberItem[] = [];
  members.map((member: Member) => {
    if (member.status === "ACTIVE") {
      memberItems.push({
        value: member.memberId,
        label: member.name,
        addressType:
          member.addressTypeId !== null ? member.addressType.description : "",
        address: member.address !== null ? member.address : "",
        comments: member.comments !== null ? member.comments : "",
      });
    }
  });

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;

    let realDate = "";
    if (data.startTime !== "") {
      const dateObject = new Date(data.startTime);
      dateObject.setHours(dateObject.getHours() + 3);
      realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    if (data.currentDate) realDate = new Date().toISOString();

    const info = {
      startTime: realDate,
      local: data.local,
      reason: data.reason,
      comments: data.comments,
      memberId: data.member,
      visitorId: data.visitor,
      operatorId: operator,
      lobbyId: lobby,
    };
    try {
      await api.post("access", info, {
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

        <DefaultCheckbox
          control={form.control}
          name="currentDate"
          label="Utilizar data e hora atuais"
        />

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional. Exemplo: Placa do veículo"
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
