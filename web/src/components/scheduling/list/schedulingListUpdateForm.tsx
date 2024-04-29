"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useSearchParams } from "next/navigation";
import { Textarea } from "../../ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { handleFileUpload } from "@/lib/firebase-upload";

const FormSchema = z.object({
  lobby: z.number(),
  member: z.number(),
  description: z.string(),
  url: z.instanceof(File),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface SchedulingList {
  schedulingListId: number;
  description: string;
  url: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  createdAt: string;
  memberId: number;
  lobbyId: number;
  operatorId: number;
  lobby: {
    name: string;
  };
  member: {
    name: string;
  };
}
interface Values {
  lobby: number;
  member: number;
  description: string;
  url: File;
  status: "ACTIVE" | "INACTIVE" | undefined;
}

export function SchedulingListUpdateForm({
  preloadedValues,
  scheduling,
}: {
  preloadedValues: Values;
  scheduling: SchedulingList;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
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
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [lobby, setLobby] = useState<Lobby>({
    lobbyId: 0,
    name: "",
  });
  const fetchLobby = async () => {
    try {
      const response = await api.get(`lobby/find/${preloadedValues.lobby}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setLobby(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  const [members, setMembers] = useState([]);
  const fetchMembers = async () => {
    try {
      const response = await api.get(`member/lobby/${preloadedValues.lobby}`, {
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
    fetchLobby();
    fetchMembers();
  }, [session]);

  interface MemberItem {
    value: number;
    label: string;
    lobbyId: number;
  }

  let memberItems: MemberItem[] = [];
  members.map((member: Member) =>
    memberItems.push({
      value: member.memberId,
      label: member.name,
      lobbyId: member.lobbyId,
    })
  );
  const id = Number(params.get("id"));

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
    } else if (scheduling.url) {
      file = scheduling.url;
    } else {
      file = "";
    }

    const info = {
      url: file,
      description: data.description,
      memberId: data.member,
      operatorId: operator,
      lobbyId: data.lobby,
      status: data.status,
    };
    try {
      await api.put(`schedulingList/${id}`, info, {
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
        <div className="p-2 bg-stone-800 rounded-md font-semibold">
          Portaria: {lobby.name}
        </div>

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
                        ? memberItems.find((item) => item.value === field.value)
                            ?.label
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
                      {memberItems.map((item) => (
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione aqui os detalhes passados pelo proprietário"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Caso você não queira alterar o arquivo previamente registrado,
                não preencha esse campo.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Pendente</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Agendada</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
