"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import DefaultTextarea from "../form/textareaDefault";
import DatePicker from "../form/datePicker";

const FormSchema = z.object({
  description: z.string(),
  date: z.date(),
});

export function CalendarForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      date: undefined,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

    const info = {
      description: data.description,
      date: data.date,
      lobbyId: lobby,
    };
    try {
      await api.post("lobbyCalendar", info);
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
        <DatePicker control={form.control} name="date" label="Dia" />

        <DefaultTextarea
          control={form.control}
          name="description"
          label="Descrição"
          placeholder="Descreva qual é a data em questão e as restrições dela..."
          rows={10}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
