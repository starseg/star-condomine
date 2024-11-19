"use client";

import * as z from "zod";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleFileUpload } from "@/lib/firebase-upload";
import { decrypt } from "@/lib/crypto";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import InputImage from "@/components/form/inputImage";
import DefaultInput from "@/components/form/inputDefault";
import MaskInput from "@/components/form/inputMask";
import DefaultTextarea from "@/components/form/textareaDefault";

const FormSchema = z.object({
  profileUrl: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
  name: z.string().min(5, {
    message: "Digite seu nome completo",
  }),
  cpf: z.string().min(11, {
    message: "Preencha o CPF corretamente",
  }),
  rg: z.string().min(8, {
    message: "Preencha o RG corretamente",
  }),
  position: z.string().min(2, {
    message: "Preencha o cargo corretamente",
  }),
  accessPeriod: z.string().min(5, {
    message: "Preencha o período de acesso corretamente",
  }),
  documentUrl: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
  terms: z.boolean(),
});

export function EmployeeForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      name: "",
      cpf: "",
      rg: "",
      position: "",
      accessPeriod: "",
      documentUrl: new File([], ""),
      terms: false,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  // const [terms, setTerms] = useState(false);

  const [isSendind, setIsSending] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);
    // PEGA O ID DA PORTARIA
    const lobby = params.get("lobby") || "";

    // FAZ O UPLOAD DA FOTO
    let file;
    if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
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
        `pessoas/foto-documento-funcionario-${timestamp}.${fileExtension}`
      );
    } else document = "";

    // REGISTRA O MORADOR
    try {
      const info = {
        type: "EMPLOYEE",
        profileUrl: file,
        documentUrl: document,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        position: data.position,
        accessPeriod: data.accessPeriod,
        lobbyId: decrypt(lobby),
      };
      await api.post("guest/member", info);

      router.push("employee/success?lobby=" + lobby);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 w-full md:w-3/4 lg:w-1/2 2xl:w-1/3"
      >
        <Image
          src="/photo-guide.jpeg"
          alt="Requisitos de foto"
          width={967}
          height={911}
          priority={true}
          className="rounded-md"
        />
        <p>
          Adicione uma foto 3x4, sem óculos e outros acessórios e com fundo
          neutro
        </p>
        <InputImage control={form.control} name="profileUrl" isFacial={true} />
        <DefaultInput
          control={form.control}
          name="name"
          label="Nome completo"
          placeholder="Digite seu nome completo"
        />
        <MaskInput
          control={form.control}
          mask="999.999.999/99"
          name="cpf"
          label="CPF"
          placeholder="Digite seu CPF"
        />
        <DefaultInput
          control={form.control}
          name="rg"
          label="RG"
          placeholder="Digite seu RG"
        />

        <DefaultInput
          control={form.control}
          name="position"
          label="Cargo"
          placeholder="Digite seu cargo"
        />

        <DefaultTextarea
          control={form.control}
          name="accessPeriod"
          label="Período de acesso"
          placeholder="Descreva os dias da semana e os horários"
        />

        <div>
          <p className="mb-1 text-sm">Documento com foto (RG/CPF ou CNH)</p>
          <InputImage control={form.control} name="documentUrl" />
        </div>

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Aceito as{" "}
                  <Link
                    href="/Politicas_privacidade_Star_Seg.pdf"
                    target="_blank"
                    className="text-primary underline"
                  >
                    políticas de privacidade
                  </Link>{" "}
                  da empresa, regidas a partir da Lei Nº 13.709 (Lei Geral de
                  Proteção de Dados).
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full text-lg"
          disabled={form.getValues("terms") === false || isSendind}
        >
          {isSendind ? "Cadastrando..." : "Cadastrar"}
        </Button>
        <p className="my-2">
          Lembre-se de conferir todos os dados antes de enviar!
        </p>
      </form>
    </Form>
  );
}
