"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useState } from "react";
import DefaultInput from "@/components/form/inputDefault";
import RadioInput from "@/components/form/inputRadio";

const FormSchema = z.object({
  model: z.string(),
  brand: z.string(),
  description: z.string(),
  isFacial: z.string(),
});

export function DeviceModelForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      model: "",
      brand: "",
      description: "",
      isFacial: "true",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const facialOptions = [
    {
      value: "true",
      label: "Sim",
    },
    {
      value: "false",
      label: "Não",
    },
  ];

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);

    try {
      await api.post("deviceModel", data);
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
          name="model"
          label="Modelo"
          placeholder="Digite o modelo do dispositivo"
        />
        <DefaultInput
          control={form.control}
          name="brand"
          label="Marca"
          placeholder="Digite a marca do dispositivo"
        />
        <DefaultInput
          control={form.control}
          name="description"
          label="Descrição"
          placeholder="Digite a descrição do dispositivo"
        />

        <RadioInput
          control={form.control}
          name="isFacial"
          label="Facial"
          object={facialOptions}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
