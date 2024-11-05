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

const FormSchema = z.object({
  member: z.number(),
  vehicleType: z.number(),
  licensePlate: z.string(),
  tag: z.string(),
  brand: z.string(),
  model: z.string(),
  color: z.string(),
  comments: z.string(),
});

export function VehicleForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      member: 0,
      vehicleType: 0,
      licensePlate: "",
      tag: "",
      brand: "",
      model: "",
      color: "",
      comments: "",
    },
  });

  interface Member {
    memberId: number;
    cpf: string;
    name: string;
  }

  interface VehicleType {
    vehicleTypeId: number;
    description: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [members, setMembers] = useState([]);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    const fetchMembersData = async () => {
      if (session)
        try {
          const response = await api.get(
            "member/lobby/" + params.get("lobby")
          );
          setMembers(response.data);
        } catch (error) {
          console.error("Erro ao obter dados:", error);
        }
    };
    const fetchVehicleTypes = async () => {
      if (session)
        try {
          const response = await api.get("vehicle/types",);
          setTypes(response.data);
        } catch (error) {
          console.error("Erro ao obter dados:", error);
        }
    };

    fetchMembersData();
    fetchVehicleTypes();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let memberItems: item[] = [];
  let typeItems: item[] = [];

  members.map((item: Member) =>
    memberItems.push({
      value: item.memberId,
      label: item.name,
    })
  );
  types.map((item: VehicleType) =>
    typeItems.push({
      value: item.vehicleTypeId,
      label: item.description,
    })
  );

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobby = Number(params.get("lobby"));

    const info = {
      lobbyId: lobby,
      memberId: data.member,
      vehicleTypeId: data.vehicleType,
      licensePlate: data.licensePlate,
      tag: data.tag,
      brand: data.brand,
      model: data.model,
      color: data.color,
      comments: data.comments,
    };
    try {
      await api.post("vehicle", info);
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
          name="member"
          label="Proprietário"
          object={memberItems}
          selectLabel="Selecione o proprietário do veículo"
          searchLabel="Buscar proprietário..."
          onSelect={(value: number) => {
            form.setValue("member", value);
          }}
        />
        <DefaultCombobox
          control={form.control}
          name="vehicleType"
          label="Tipo de veículo"
          object={typeItems}
          selectLabel="Selecione o tipo do veículo"
          searchLabel="Buscar tipo..."
          onSelect={(value: number) => {
            form.setValue("vehicleType", value);
          }}
        />
        <DefaultInput
          control={form.control}
          name="licensePlate"
          label="Placa"
          placeholder="Digite a placa do veículo"
        />
        <DefaultInput
          control={form.control}
          name="tag"
          label="Tag"
          placeholder="Digite a tag do veículo"
        />
        <DefaultInput
          control={form.control}
          name="brand"
          label="Marca"
          placeholder="Digite a marca do veículo"
        />
        <DefaultInput
          control={form.control}
          name="model"
          label="Modelo"
          placeholder="Digite o modelo do veículo"
        />
        <DefaultInput
          control={form.control}
          name="color"
          label="Cor"
          placeholder="Digite a cor do veículo"
        />
        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
