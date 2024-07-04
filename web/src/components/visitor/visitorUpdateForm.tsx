"use client";

import * as z from "zod";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { Checkbox } from "../ui/checkbox";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import InputImage from "../form/inputImage";
import DefaultInput from "../form/inputDefault";
import MaskInput from "../form/inputMask";
import RadioInput from "../form/inputRadio";
import DefaultTextarea from "../form/textareaDefault";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  name: z.string().trim(),
  cpf: z.string(),
  rg: z.string(),
  phone: z.string(),
  type: z.string(),
  relation: z.string(),
  comments: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
interface Visitor {
  visitorId: number;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  relation: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  visitorTypeId: number;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
}
interface Values {
  profileUrl: File;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  relation: string;
  comments: string;
  type: string;
}

export function VisitorUpdateForm({
  preloadedValues,
  visitor,
}: {
  preloadedValues: Values;
  visitor: Visitor;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  const { data: session } = useSession();
  const router = useRouter();

  interface VisitorTypes {
    visitorTypeId: number;
    description: string;
  }

  const [visitorType, setVisitorType] = useState<VisitorTypes[]>([]);
  const fetchVisitorTypes = async () => {
    if (session)
      try {
        const response = await api.get("visitor/types", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setVisitorType(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchVisitorTypes();
  }, [session]);

  const status = [
    {
      value: "ACTIVE",
      label: "Ativo",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
    },
  ];

  const [removeFile, setRemoveFile] = useState(false);
  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);

    // FAZ O UPLOAD DA FOTO
    let file;
    if (removeFile) {
      file = "";
      if (visitor.profileUrl.length > 0) {
        deleteFile(visitor.profileUrl);
      }
    } else if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-visita-${timestamp}.${fileExtension}`
      );
    } else if (visitor?.profileUrl) file = visitor.profileUrl;
    else file = "";

    // REGISTRA O visitante
    try {
      const info = {
        profileUrl: file,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        phone: data.phone,
        visitorTypeId: Number(data.type),
        relation: data.relation,
        comments: data.comments,
        status: data.status,
      };
      await api.put("visitor/" + visitor.visitorId, info, {
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
        <div className="flex gap-4 items-center justify-center">
          {visitor.profileUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={visitor.profileUrl} alt="Foto de perfil" width={80} />
              <p className="text-sm text-center mt-2">Foto atual</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <UserCircle className="w-20 h-20" />
              <p className="text-sm text-center mt-2">
                Nenhuma foto <br /> cadastrada
              </p>
            </div>
          )}
          <div className="w-10/12">
            <InputImage control={form.control} name="profileUrl" />

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="check"
                onClick={() => {
                  setRemoveFile(!removeFile);
                }}
              />
              <label
                htmlFor="check"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remover foto - {removeFile ? "sim" : "não"}
              </label>
            </div>
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

        <RadioInput
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
