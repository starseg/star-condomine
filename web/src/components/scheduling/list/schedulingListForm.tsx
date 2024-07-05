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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command";
import { handleFileUpload } from "@/lib/firebase-upload";
import DefaultTextarea from "@/components/form/textareaDefault";
import InputFile from "@/components/form/inputFile";

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
        const response = await api.get("lobby", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setLobbies(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [members, setMembers] = useState([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get("member", {
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
      await api.post("schedulingList", info, {
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
        <FormField
          control={form.control}
          name="lobby"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-4">
              <FormLabel>Portaria</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? lobbyItems.find((item) => item.value === field.value)
                            ?.label
                        : "Selecione a portaria"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar portaria..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {lobbyItems.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue("lobby", item.value);
                            setLobbyField(item.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Visitado / Responsável</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? filteredMemberItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Selecione para quem é o agendamento"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar pessoa..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {filteredMemberItems.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue("member", item.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
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
