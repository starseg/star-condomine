"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function residentCredentials() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    fetchTagTypes();
    fetchTagData();
  }, [session]);

  const fetchTagData = async () => {
    try {
      const types = await api.get("tag/member/" + params.get("id"), {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTagTypes(types.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  // BUSCA OS TIPOS DE TAG
  interface ITagTypes {
    tagTypeId: number;
    description: string;
  }
  const [tagTypes, setTagTypes] = useState<ITagTypes[]>([]);
  const fetchTagTypes = async () => {
    try {
      const types = await api.get("tag/types", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTagTypes(types.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  // RETORNA O ID DO TIPO DA TAG
  let tag = 0;
  let card = 0;
  tagTypes.forEach((type) => {
    if (type.description === "Tag") tag = type.tagTypeId;
    if (type.description === "Cartão") card = type.tagTypeId;
  });

  return (
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Credenciais</h1>
      <div className="max-h-[60vh] overflow-x-auto"></div>
    </section>
  );
}
