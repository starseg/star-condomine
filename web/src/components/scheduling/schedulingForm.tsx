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
  startDate: z.date(),
  endDate: z.date(),
  comments: z.string(),
});

export function SchedulingForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visitor: 0,
      member: 0,
      reason: "",
      location: "",
      startDate: undefined,
      endDate: undefined,
      comments: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const fetchVisitors = async () => {
    if (session)
      try {
        const response = await api.get("visitor/lobby/" + params.get("lobby"));
        setVisitors(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [members, setMembers] = useState<Member[]>([]);
  const fetchMembers = async () => {
    if (session)
      try {
        const response = await api.get("member/lobby/" + params.get("lobby"));
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

  interface memberItem {
    value: number;
    label: string;
    addressType: string | null;
    address: string | null;
    comments: string;
  }

  let visitorItems: item[] = [];
  visitors.map((visitor: Visitor) => {
    if (visitor.status === "ACTIVE") {
      visitorItems.push({
        value: visitor.visitorId,
        label: visitor.name,
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

    const info = {
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      location: data.location,
      reason: data.reason,
      comments: data.comments,
      memberId: data.member,
      visitorId: data.visitor,
      operatorId: operator,
      lobbyId: lobby,
    };
    try {
      await api.post("scheduling", info);
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
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
