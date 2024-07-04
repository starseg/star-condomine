"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";
import RadioInput from "../form/inputRadio";

const FormSchema = z.object({
  type: z.number(),
  value: z.string(),
  comments: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface Values {
  type: number;
  value: string;
  comments: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
}

export function CredentialsUpdateForm({
  preloadedValues,
}: {
  preloadedValues: Values;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  interface TagTypes {
    tagTypeId: number;
    description: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [tagType, setTagType] = useState<TagTypes[]>([]);
  const fetchTagTypes = async () => {
    try {
      const response = await api.get("tag/types", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTagType(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchTagTypes();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];

  tagType.map((type: TagTypes) =>
    items.push({
      value: type.tagTypeId,
      label: type.description,
    })
  );

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

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const id = params.get("id");

    const info = {
      type: data.type,
      value: data.value,
      comments: data.comments,
      status: data.status,
    };
    try {
      await api.put("tag/" + id, info, {
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
        <DefaultCombobox
          control={form.control}
          name="type"
          label="Tipo"
          object={items}
          selectLabel="Selecione um tipo"
          searchLabel="Buscar tipo..."
          onSelect={(value: number) => {
            form.setValue("type", value);
          }}
        />

        <DefaultInput
          control={form.control}
          name="value"
          label="Valor"
          placeholder="Valor da credencial"
        />

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Adicione aqui qualquer informação adicional relevante"
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
