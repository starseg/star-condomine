"use client";

import DefaultCombobox from "@/components/form/comboboxDefault";
import InputFile from "@/components/form/inputFile";
import DefaultTextarea from "@/components/form/textareaDefault";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import * as z from "zod";

const FormSchema = z.object({
  lobby: z.number(),
  member: z.number(),
  description: z.string(),
  url: z.instanceof(File),
});

export function SchedulingListForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lobby: 0,
      member: 0,
      description: "",
      url: new File([], ""),
    },
  });

  interface Lobby {
    lobbyId: number;
    name: string;
  }
  interface Member {
    memberId: number;
    name: string;
    lobbyId: number;
  }

  const { data: session } = useSession();
  const router = useRouter();

  const [lobbies, setLobbies] = useState([]);
  const fetchLobbies = async () => {
    if (session)
      try {
        const response = await api.get("lobby");
        setLobbies(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [members, setMembers] = useState([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get("member");
        setMembers(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchLobbies();
    fetchMembers();
  }, [session]);

  interface LobbyItem {
    value: number;
    label: string;
  }

  interface MemberItem {
    value: number;
    label: string;
    lobbyId: number;
  }

  let lobbyItems: LobbyItem[] = [];
  lobbies.map((lobby: Lobby) =>
    lobbyItems.push({
      value: lobby.lobbyId,
      label: lobby.name,
    })
  );

  let memberItems: MemberItem[] = [];
  members.map((member: Member) =>
    memberItems.push({
      value: member.memberId,
      label: member.name,
      lobbyId: member.lobbyId,
    })
  );

  const [filteredMemberItems, setFilteredMemberItems] = useState<MemberItem[]>(
    []
  );
  const [lobbyField, setLobbyField] = useState(0);
  useEffect(() => {
    if (lobbyField !== 0) {
      const filteredItems = memberItems.filter(
        (item) => item.lobbyId === lobbyField
      );
      setFilteredMemberItems(filteredItems);
    } else {
      setFilteredMemberItems(memberItems);
    }
  }, [lobbyField]);

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const operator = session?.payload.user.id || null;

    const timestamp = new Date().toISOString();
    let file;
    if (data.url instanceof File && data.url.size > 0) {
      const fileExtension = data.url.name.split(".").pop();
      file = await handleFileUpload(
        data.url,
        `agendamentos/proprietario_${data.member}_${timestamp}.${fileExtension}`
      );
    } else file = "";

    const info = {
      url: file,
      description: data.description,
      memberId: data.member,
      operatorId: operator,
      lobbyId: data.lobby,
    };
    try {
      await api.post("schedulingList", info);
      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mt-4 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <DefaultCombobox
          control={form.control}
          name="lobby"
          label="Portaria"
          object={lobbyItems}
          selectLabel="Selecione a portaria"
          searchLabel="Buscar portaria..."
          onSelect={(value: number) => {
            form.setValue("lobby", value);
            setLobbyField(value);
          }}
        />

        <DefaultCombobox
          control={form.control}
          name="member"
          label="Visitado / Responsável"
          object={filteredMemberItems}
          selectLabel={
            isMobile
              ? "Para quem é o agendamento?"
              : "Selecione para quem é o agendamento"
          }
          searchLabel="Buscar pessoa..."
          onSelect={(value: number) => {
            form.setValue("member", value);
          }}
        />

        <DefaultTextarea
          control={form.control}
          name="description"
          label="Descrição"
          placeholder="Adicione aqui os detalhes passados pelo proprietário"
        />

        <InputFile
          control={form.control}
          name="url"
          complement="(opcional)"
          description="Se for adicionado um arquivo com a lista, informar na descrição e relacionar as datas de agendamento."
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
