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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const FormSchema = z.object({
  name: z.string(),
  group: z.number(),
  timeZone: z.number(),
  area: z.number(),
});

export function AccessRuleFullRegister() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      group: 0,
      timeZone: 0,
      area: 0,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const fetchGroups = async () => {
    if (session)
      try {
        const response = await api.get("group", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

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

  const [lobbies, setLobbies] = useState<Lobby[]>([]);
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

  useEffect(() => {
    fetchGroups();
    fetchTimeZones();
    fetchLobbies();
  }, [session]);

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      /*
       * POST accessRule
       * POST areaAccessRule
       * POST groupAccessRule
       * POST accessRuleTimeZone
       */
      const accessRule = await api.post(
        "accessRule",
        {
          name: data.name,
          type: 1,
          priority: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        }
      );
      if (accessRule) {
        const accessRuleId = accessRule.data.accessRuleId;

        await api.post(
          "areaAccessRule",
          {
            areaId: data.area,
            accessRuleId: accessRuleId,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );

        await api.post(
          "groupAccessRule",
          {
            accessRuleId: accessRuleId,
            groupId: data.group,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );

        await api.post(
          "accessRuleTimeZone",
          {
            accessRuleId: accessRuleId,
            timeZoneId: data.timeZone,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );
      }
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Dê um nome à sua nova regra"
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
          name="area"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Relacione com uma portaria (onde se aplica)</FormLabel>
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
                        ? lobbies.find((lobby) => lobby.lobbyId === field.value)
                            ?.name
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
                      {lobbies.map((lobby) => (
                        <CommandItem
                          value={lobby.name}
                          key={lobby.lobbyId}
                          onSelect={() => {
                            form.setValue("area", lobby.lobbyId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              lobby.lobbyId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {lobby.name}
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
          name="group"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Relacione com um grupo (a quem se aplica)</FormLabel>
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
                        ? groups.find((group) => group.groupId === field.value)
                            ?.name
                        : "Selecione o grupo"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar grupo..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {groups.map((group) => (
                        <CommandItem
                          value={group.name}
                          key={group.groupId}
                          onSelect={() => {
                            form.setValue("group", group.groupId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              group.groupId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {group.name}
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
          name="timeZone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Relacione com um horário (quando se aplica)</FormLabel>
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
                        ? timeZones.find(
                            (timeZone) => timeZone.timeZoneId === field.value
                          )?.name
                        : "Selecione o horário"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar horário..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {timeZones.map((timeZone) => (
                        <CommandItem
                          value={timeZone.name}
                          key={timeZone.timeZoneId}
                          onSelect={() => {
                            form.setValue("timeZone", timeZone.timeZoneId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              timeZone.timeZoneId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {timeZone.name}
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

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
