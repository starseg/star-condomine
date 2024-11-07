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
import { format } from "date-fns";
import { useState } from "react";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";
import DefaultCheckbox from "../form/checkboxDefault";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  currentDate: z.boolean(),
});

export function ProblemForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      currentDate: false,
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
    const operator = session?.payload.user.id || null;

    let realDate = "";
    if (data.date !== "") {
      const dateObject = new Date(data.date);
      dateObject.setHours(dateObject.getHours() + 3);
      realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    if (data.currentDate) realDate = new Date().toISOString();

    const info = {
      title: data.title,
      description: data.description,
      date: realDate,
      lobbyId: lobby,
      operatorId: operator,
    };
    try {
      await api.post("lobbyProblem", info);
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
        <DefaultInput
          control={form.control}
          name="title"
          label="Título"
          placeholder="Uma breve descrição do problema..."
        />
        <DefaultTextarea
          control={form.control}
          name="description"
          label="Descrição"
          placeholder="Descreva detalhadamente o problema ocorrido..."
          rows={10}
        />
        <DefaultInput
          control={form.control}
          name="date"
          label="Data e hora"
          placeholder="Data e hora"
          type="datetime-local"
        />
        <DefaultCheckbox
          control={form.control}
          name="currentDate"
          label="Utilizar data e hora atuais"
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
