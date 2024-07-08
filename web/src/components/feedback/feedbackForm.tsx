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
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";

const FormSchema = z.object({
  name: z.string(),
  subject: z.string(),
  message: z.string(),
});

export function FeedbackForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      subject: "",
      message: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const info = {
      name: data.name,
      subject: data.subject,
      message: data.message,
    };
    try {
      await api.post("feedback", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      router.push("/feedback/success");
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
          name="name"
          label="Nome"
          placeholder="Digite seu nome"
        />
        <DefaultInput
          control={form.control}
          name="subject"
          label="Assunto *"
          placeholder="Do que se trata esse contato"
        />
        <DefaultTextarea
          control={form.control}
          name="message"
          label="Mensagem *"
          placeholder="Deixe aqui sua mensagem"
          rows={10}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          Enviar
        </Button>
      </form>
    </Form>
  );
}
