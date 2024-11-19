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
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
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
import InputImage from "../form/inputImage";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";
import MaskInput from "../form/inputMask";
import RadioInput from "../form/inputRadio";
import DefaultCombobox from "../form/comboboxDefault";
import { TakeMemberPhoto } from "../control-id/takeMemberPhoto";
import { toast } from "react-toastify";
import { resizeImage } from "../form/resizeImage";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  documentUrl: z.instanceof(File),
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
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export function VisitorForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      documentUrl: new File([], ""),
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
  const params = new URLSearchParams(searchParams.toString());
  const lobby = params.get("lobby");

  interface VisitorType {
    visitorTypeId: number;
    description: string;
  }

  const [visitorType, setVisitorType] = useState<VisitorType[]>([]);
  const fetchVisitorTypes = async () => {
    if (session)
      try {
        const response = await api.get("visitor/types");
        setVisitorType(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  const [members, setMembers] = useState<Member[]>([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get("member/lobby/" + lobby);
        setMembers(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [lobbyData, setLobbyData] = useState<Lobby>();
  async function fetchLobbyData() {
    if (session)
      try {
        const getLobby = await api.get(`/lobby/find/${lobby}`);
        setLobbyData(getLobby.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }

  useEffect(() => {
    fetchVisitorTypes();
    fetchMembers();
    fetchLobbyData();
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
      if (!data.profileUrl.type.includes("image")) {
        toast.error("O arquivo de foto do usuário precisa ser uma imagem.")
        setIsSendind(false)
        return
      }
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();

      const imageFile = await resizeImage(data.profileUrl);

      file = await handleFileUpload(
        imageFile,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else file = "";

    // FAZ O UPLOAD DO DOCUMENTO
    let document;
    if (data.documentUrl instanceof File && data.documentUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.documentUrl.name.split(".").pop();
      document = await handleFileUpload(
        data.documentUrl,
        `pessoas/foto-documento-proprietario-${timestamp}.${fileExtension}`
      );
    } else document = "";

    // REGISTRA O visitante
    try {
      const info = {
        profileUrl: file,
        documentUrl: document,
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
      const response = await api.post("visitor", info);
      // SE A PESSOA JÁ ESTIVER ACESSANDO, REGISTRA O ACESSO
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
          await api.post("access", access,);
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error);
          throw error;
        }
      }
      // SE A PESSOA JÁ PRECISAR, AGENDA SUA VISITA
      if (
        scheduling &&
        data.startDate !== undefined &&
        data.endDate !== undefined
      ) {
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
          await api.post("scheduling", info,);
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

  function handleSavePhoto(file: File) {
    form.setValue("profileUrl", file);
    toast.success("Foto salva", {
      theme: "colored",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <div>
          <p className="mb-1 text-sm">Foto de perfil</p>
          <div className="flex gap-4">
            <InputImage control={form.control} name="profileUrl" />
            {lobbyData && lobbyData.ControllerBrand.name === "Control iD" && (
              <TakeMemberPhoto savePhoto={handleSavePhoto} />
            )}
          </div>
        </div>

        <DefaultInput
          control={form.control}
          name="name"
          label="Nome completo"
          placeholder="Digite o nome e sobrenome do visitante"
        />

        <DefaultInput
          control={form.control}
          name="cpf"
          label="CPF/CNPJ"
          placeholder="Digite o CPF ou CNPJ do visitante"
        />

        <DefaultInput
          control={form.control}
          name="rg"
          label="RG"
          placeholder="Digite o RG do visitante"
        />

        <MaskInput
          control={form.control}
          mask="(99) 99999-9999"
          name="phone"
          label="Telefone"
          placeholder="Digite o telefone do visitante"
        />

        <RadioInput
          control={form.control}
          name="type"
          label="Tipo de visitante"
          object={visitorType}
          idExtractor={(item) => item.visitorTypeId}
          descriptionExtractor={(item) => item.description}
        />

        <DefaultInput
          control={form.control}
          name="relation"
          label="Relação / Empresa"
          placeholder="Qual é a relação desse visitante com a portaria?"
        />

        <DefaultTextarea
          control={form.control}
          name="visitorComments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <div>
          <p className="mb-1 text-sm">
            Documento com foto do proprietário responsável (opcional)
          </p>
          <InputImage control={form.control} name="documentUrl" />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            onClick={() => {
              setIsAccessing(!isAccessing);
            }}
          />
          <label
            htmlFor="terms"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            A pessoa já está acessando a portaria?
          </label>
        </div>

        <div>
          {isAccessing && (
            <div className="space-y-6">
              <DefaultCombobox
                control={form.control}
                name="host"
                label="Visitado"
                object={items}
                selectLabel="Selecione a pessoa visitada"
                searchLabel="Buscar pessoa..."
                onSelect={(value: number) => {
                  form.setValue("host", value);
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

              <DefaultTextarea
                control={form.control}
                name="comments"
                label="Observações"
                placeholder="Alguma informação adicional..."
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
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            Registrar agendamento?
          </label>
        </div>

        <div>
          {scheduling && (
            <div className="space-y-6">
              <DefaultCombobox
                control={form.control}
                name="scheduleHost"
                label="Visitado"
                object={items}
                selectLabel="Selecione a pessoa visitada"
                searchLabel="Buscar pessoa..."
                onSelect={(value: number) => {
                  form.setValue("scheduleHost", value);
                }}
              />

              <DefaultInput
                control={form.control}
                name="scheduleReason"
                label="Motivo"
                placeholder="Por que está sendo feito esse agendamento?"
              />

              <DefaultInput
                control={form.control}
                name="scheduleLocation"
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
                              <SelectItem value="3650">Em 10 anos</SelectItem>
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

              <DefaultTextarea
                control={form.control}
                name="scheduleComments"
                label="Observações"
                placeholder="Alguma informação adicional..."
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
