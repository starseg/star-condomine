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
import DefaultInput from "../form/inputDefault";
import DefaultCombobox from "../form/comboboxDefault";

const FormSchema = z.object({
  name: z.string(),
  ip: z.string(),
  ramal: z.string(),
  description: z.string(),
  model: z.number(),
  login: z.string(),
  password: z.string(),
});

interface Values {
  name: string;
  ip: string;
  ramal: string;
  description: string;
  model: number;
  login: string;
  password: string;
}

export function DeviceUpdateForm({
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
  const params = new URLSearchParams(searchParams);

  const [deviceModel, setDeviceModel] = useState<DeviceModel[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("device/models", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDeviceModel(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };

    fetchModels();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];

  deviceModel.map((model: DeviceModel) =>
    items.push({
      value: model.deviceModelId,
      label: model.model + " - " + model.brand,
    })
  );

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const id = params.get("id");

    const info = {
      name: data.name,
      ip: data.ip,
      ramal: parseInt(data.ramal),
      description: data.description,
      deviceModelId: data.model,
      login: data.login,
      password: data.password,
    };
    try {
      await api.put("device/" + id, info, {
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
          name="name"
          label="Nome"
          placeholder="Identificação do dispositivo"
        />
        <DefaultInput
          control={form.control}
          name="ip"
          label="IP"
          placeholder="Digite o IP do dispositivo. Ex: 192.168.0.1"
        />
        <DefaultInput
          control={form.control}
          type="number"
          name="ramal"
          label="Número do ramal"
          placeholder="Digite o número do ramal"
        />
        <DefaultInput
          control={form.control}
          name="description"
          label="Descrição"
          placeholder="Digite a descrição do dispositivo"
        />
        <DefaultInput
          control={form.control}
          name="login"
          label="Login"
          placeholder="Login do dispositivo"
        />

        <DefaultInput
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Senha do dispositivo"
        />

        <DefaultCombobox
          control={form.control}
          name="model"
          label="Modelo do dispositivo"
          object={items}
          selectLabel="Selecione um modelo"
          searchLabel="Buscar modelo..."
          onSelect={(value: number) => {
            form.setValue("model", value);
          }}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
