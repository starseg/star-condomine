"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, FilePlus2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  memberId: z.number(),
  groupId: z.number(),
});

export default function MemberGroupForm() {
  const { triggerUpdate, update } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      memberId: 0,
      groupId: 0,
    },
  });
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [members, setMembers] = useState<Member[]>([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get(`member/lobby/${lobby}`);
        setMembers(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [groups, setGroups] = useState<Group[]>([]);
  const fetchGroups = async () => {
    if (session)
      try {
        const response = await api.get(`group/lobby/${lobby}`);
        setGroups(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchMembers();
    fetchGroups();
  }, [session, update]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        memberId: data.memberId,
        groupId: data.groupId,
      };

      const response = await api.post(`memberGroup`, info);
      if (response.status === 201) {
        toast.success("Relação registrada!", {
          theme: "colored",
        });
        form.reset({
          memberId: 0,
          groupId: 0,
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
          <FilePlus2Icon /> Criar relação
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader className="mb-4">
          <SheetTitle>Criar relação</SheetTitle>
          <SheetDescription>Cadastre aqui uma nova relação.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Membro</FormLabel>
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
                            ? members.find(
                              (member) => member.memberId === field.value
                            )?.name
                            : "Selecione uma pessoa"}
                          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar pessoa..." />
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                        <CommandGroup>
                          {members.map((member) => (
                            <CommandItem
                              value={member.name}
                              key={member.memberId}
                              onSelect={() => {
                                form.setValue("memberId", member.memberId);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  member.memberId === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {member.name}
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
              name="groupId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Grupo</FormLabel>
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
                            ? groups.find(
                              (group) => group.groupId === field.value
                            )?.name
                            : "Selecione um grupo"}
                          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
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
                                form.setValue("groupId", group.groupId);
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
