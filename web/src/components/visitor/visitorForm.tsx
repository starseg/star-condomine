"use client";

import * as z from "zod";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { handleFileUpload } from "@/lib/firebase-upload";
import { format, addDays } from "date-fns";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  name: z
    .string()
    .min(6, {
      message: "O nome completo precisa ter ao menos 6 caracteres.",
    })
    .trim(),
  cpf: z.string(),
  rg: z.string(),
  phone: z.string(),
  type: z.string(),
  relation: z.string(),
  visitorComments: z.string().optional(),

  isAccessing: z.boolean(),
  host: z.number().optional(),
  reason: z.string().optional(),
  local: z.string().optional(),
  comments: z.string().optional(),

  schedule: z.boolean(),
  scheduleHost: z.number().optional(),
  scheduleReason: z.string().optional(),
  scheduleLocation: z.string().optional(),
  scheduleComments: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export function VisitorForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      name: "",
      cpf: "",
      rg: "",
      phone: "",
      type: "1",
      relation: "",
      visitorComments: "",
      isAccessing: false,
      host: 0,
      reason: "",
      local: "",
      comments: "",
      schedule: false,
      scheduleHost: 0,
      scheduleReason: "",
      scheduleLocation: "",
      scheduleComments: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobby = params.get("lobby");

  interface VisitorTypes {
    visitorTypeId: number;
    description: string;
  }

  const [visitorType, setVisitorType] = useState<VisitorTypes[]>([]);
  const fetchVisitorTypes = async () => {
    try {
      const response = await api.get("visitor/types", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVisitorType(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [members, setMembers] = useState<Member[]>([]);
  const fetchMembers = async () => {
    try {
      const response = await api.get("member/lobby/" + lobby, {
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
    fetchVisitorTypes();
    fetchMembers();
  }, [session]);

  interface item {
    value: number;
    label: string;
    addressType: string | null;
    address: string | null;
    comments: string;
  }
  let items: item[] = [];

  members.map((member: Member) => {
    items.push({
      value: member.memberId,
      label: member.name,
      addressType:
        member.addressTypeId !== null ? member.addressType.description : "",
      address: member.address !== null ? member.address : "",
      comments: member.comments !== null ? member.comments : "",
    });
  });

  const [isAccessing, setIsAccessing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // PEGA O ID DA PORTARIA
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;

    // FAZ O UPLOAD DA FOTO
    let file;
    if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-visita-${timestamp}.${fileExtension}`
      );
    } else file = "";

    // REGISTRA O visitante
    try {
      const info = {
        profileUrl: file,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        phone: data.phone,
        visitorTypeId: Number(data.type),
        relation: data.relation,
        comments: data.visitorComments,
        startDate: null,
        endDate: null,
        lobbyId: Number(lobby),
      };
      const response = await api.post("visitor", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      if (isAccessing) {
        try {
          const access = {
            memberId: Number(data.host),
            visitorId: Number(response.data.visitorId),
            startTime: new Date().toISOString(),
            local: data.local,
            reason: data.reason,
            comments: data.comments,
            operatorId: Number(operator),
            lobbyId: Number(lobby),
          };
          await api.post("access", access, {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error);
          throw error;
        }
      }
      if (scheduling) {
        const info = {
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          location: data.scheduleLocation,
          reason: data.scheduleReason,
          comments: data.scheduleComments,
          memberId: Number(data.scheduleHost),
          visitorId: Number(response.data.visitorId),
          operatorId: Number(operator),
          lobbyId: Number(lobby),
        };
        try {
          await api.post("scheduling", info, {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error);
          throw error;
        }
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
          name="profileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome e sobrenome do visitante"
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o CPF ou CNPJ do visitante"
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
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o RG do visitante"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  type="text"
                  placeholder="Digite o telefone do visitante"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de visitante</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {visitorType.map((type) => {
                    return (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={type.visitorTypeId}
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={type.visitorTypeId.toString()}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.description}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relação / Empresa</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Qual é a relação desse visitante com a portaria?"
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
          name="visitorComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            onClick={() => {
              setIsAccessing(!isAccessing);
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            A pessoa já está acessando a portaria?
          </label>
        </div>

        <div>
          {isAccessing && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Visitado</FormLabel>
                    <FormControl>
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
                                ? items.find(
                                    (item) => item.value === field.value
                                  )?.label
                                : "Selecione a pessoa visitada"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                          <Command className="w-full">
                            <CommandInput placeholder="Buscar pessoa..." />
                            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                            <CommandGroup>
                              {items.map((item) => (
                                <CommandItem
                                  value={item.label}
                                  key={item.value}
                                  onSelect={() => {
                                    form.setValue("host", item.value);
                                  }}
                                  className={cn(
                                    item.comments.length > 0 &&
                                      "text-yellow-400 font-semibold"
                                  )}
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
                                  {item.address ? (
                                    <>
                                      {" "}
                                      - {item.addressType} {item.address}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Por que está sendo feita essa visita?"
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
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local da visita</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Para onde está indo? Casa, Salão de Festas..."
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
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguma informação adicional..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="schedule"
            onClick={() => {
              setScheduling(!scheduling);
            }}
          />
          <label
            htmlFor="schedule"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Registrar agendamento?
          </label>
        </div>

        <div>
          {scheduling && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="scheduleHost"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Visitado</FormLabel>
                    <FormControl>
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
                                ? items.find(
                                    (item) => item.value === field.value
                                  )?.label
                                : "Selecione a pessoa visitada"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                          <Command className="w-full">
                            <CommandInput placeholder="Buscar pessoa..." />
                            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                            <CommandGroup>
                              {items.map((item) => (
                                <CommandItem
                                  value={item.label}
                                  key={item.value}
                                  onSelect={() => {
                                    form.setValue("scheduleHost", item.value);
                                  }}
                                  className={cn(
                                    item.comments.length > 0 &&
                                      "text-yellow-400 font-semibold"
                                  )}
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
                                  {item.address ? (
                                    <>
                                      {" "}
                                      - {item.addressType} {item.address}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduleReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Por que está sendo feito esse agendamento?"
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
                name="scheduleLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local da visita</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Para onde está indo? Casa, Salão de Festas..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-2 space-y-2"
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
                              <SelectItem value="3650">Em 10 anos</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="rounded-md border">
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
              <FormField
                control={form.control}
                name="scheduleComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguma informação adicional..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
