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
import { useEffect, useState } from "react";
import { handleFileUpload } from "@/lib/firebase-upload";
import { decrypt } from "@/lib/crypto";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import InputImage from "@/components/form/inputImage";
import DefaultInput from "@/components/form/inputDefault";
import MaskInput from "@/components/form/inputMask";
import RadioInput from "@/components/form/inputRadio";
import DefaultTextarea from "@/components/form/textareaDefault";

const FormSchema = z.object({
  profileUrl: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
  name: z.string().min(5, {
    message: "Por favor, insira o nome completo",
  }),
  cpf: z.string().min(11, {
    message: "Preencha o CPF corretamente",
  }),
  rg: z.string().min(8, {
    message: "Preencha o RG corretamente",
  }),
  phone: z.string().min(10, {
    message: "Preencha o telefone corretamente",
  }),
  type: z.string(),
  relation: z.string().min(1, {
    message: "Preencha o este campo",
  }),
  comments: z.string().min(1, {
    message: "Preencha o este campo",
  }),
  documentUrl: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
  facial: z.boolean(),
  terms: z.boolean(),
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
      comments: "",
      documentUrl: new File([], ""),
      facial: false,
      terms: false,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobby = params.get("lobby") || "";

  interface VisitorTypes {
    visitorTypeId: number;
    description: string;
  }

  const [visitorType, setVisitorType] = useState<VisitorTypes[]>([]);
  const fetchVisitorTypes = async () => {
    try {
      const response = await api.get("guest/visitor/types");
      setVisitorType(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchVisitorTypes();
  }, []);

  const [isSendind, setIsSending] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);

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
        comments: data.facial
          ? "FACIAL AUTORIZADA - ".concat(data.comments)
          : "FACIAL NÃO AUTORIZADA - ".concat(data.comments),
        startDate: null,
        endDate: null,
        status: "INACTIVE",
        lobbyId: decrypt(lobby),
      };
      await api.post("guest/visitor", info);

      router.push("visitor/success?lobby=" + lobby);
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
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
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
        <InputImage control={form.control} name="profileUrl" />
        <DefaultInput
          control={form.control}
          name="name"
          label="Nome completo"
          placeholder="Digite o nome e sobrenome do visitante"
        />
        <MaskInput
          control={form.control}
          mask="999.999.999/99"
          name="cpf"
          label="CPF"
          placeholder="Digite o CPF do visitante"
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
          name="comments"
          label="Nome e endereço do proprietário"
          placeholder="Escreva aqui qual é o nome completo e o endereço do proprietário"
        />

        <div>
          <p className="mb-1 text-sm">
            Documento com foto do proprietário (RG/CPF ou CNH)
          </p>
          <InputImage control={form.control} name="documentUrl" />
        </div>

        <FormField
          control={form.control}
          name="facial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Autorizar acesso facial, confirmando ciência do{" "}
                  <Link
                    href="/Termo_de_responsabilidade_de_cadastro_de_visitante.pdf"
                    target="_blank"
                    className="underline text-primary"
                  >
                    termo de responsabilidade
                  </Link>
                  .
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                    className="underline text-primary"
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
      </form>
    </Form>
  );
}
