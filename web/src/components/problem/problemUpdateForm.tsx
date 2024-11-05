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
import DefaultTextarea from "../form/textareaDefault";
import DefaultInput from "../form/inputDefault";
import RadioInput from "../form/inputRadio";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface Values {
  title: string;
  description: string;
  date: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
}

export function ProblemUpdateForm({
  preloadedValues,
}: {
  preloadedValues: Values;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const status = [
    {
      value: "ACTIVE",
      label: "Ativo",
    },
    {
      value: "INACTIVE",
      label: "Resolvido",
    },
  ];

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;
    const id = params.get("id");

    const dateObject = new Date(data.date);
    dateObject.setHours(dateObject.getHours() + 3);
    let realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    const info = {
      title: data.title,
      description: data.description,
      status: data.status,
      date: realDate,
      operatorId: operator,
    };
    try {
      await api.put("lobbyProblem/" + id, info, {
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
        <RadioInput
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
