"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import React, { useState } from "react";
import DatePicker from "../form/datePicker";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";

const FormSchema = z.object({
  date: z.date(),
  title: z.string(),
  message: z.string(),
});

export function NotificationForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: undefined,
      title: "",
      message: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const info = {
      date: data.date,
      title: data.title,
      message: data.message,
    };
    try {
      await api.post("notification", info, {
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
        <DatePicker
          control={form.control}
          name="date"
          label="Data de liberação"
        />
        <DefaultInput
          control={form.control}
          name="title"
          label="Título"
          placeholder="Crie um título para a notificação"
        />
        <DefaultTextarea
          control={form.control}
          name="message"
          label="Mensagem"
          placeholder="Deixe aqui sua mensagem"
          rows={10}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          Criar
        </Button>
      </form>
    </Form>
  );
}
