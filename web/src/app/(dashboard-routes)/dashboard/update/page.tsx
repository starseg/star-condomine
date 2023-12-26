"use client";
import LoadingIcon from "@/components/loadingIcon";
import { LobbyUpdateForm } from "@/components/lobby/lobbyUpdateForm";
import api from "@/lib/axios";
import { Menu } from "@/components/menu";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDevice() {
  interface Lobby {
    lobbyId: number;
    cnpj: string;
    name: string;
    responsible: string;
    telephone: string;
    scheduling: string;
    procedures: string;
    datasheet: string;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    createdAt: string;
    updatedAt: string;
    type: "CONDOMINIUM" | "COMPANY" | undefined;
  }
  interface Values {
    type: "CONDOMINIUM" | "COMPANY" | undefined;
    cnpj: string;
    name: string;
    responsible: string;
    telephone: string;
    scheduling: string;
    procedures: string;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    datasheet: File;
  }

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [data, setData] = useState<Values>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("lobby/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setLobby(response.data);
      } catch (error) {
        console.error("(Lobby) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (lobby) {
      setData({
        type: lobby?.type || "CONDOMINIUM",
        cnpj: lobby?.cnpj || "",
        name: lobby?.name || "",
        responsible: lobby?.responsible || "",
        telephone: lobby?.telephone || "",
        scheduling: lobby?.scheduling || "",
        procedures: lobby?.procedures || "",
        cep: lobby?.cep || "",
        state: lobby?.state || "",
        city: lobby?.city || "",
        neighborhood: lobby?.neighborhood || "",
        street: lobby?.street || "",
        number: lobby?.number || "",
        complement: lobby?.complement || "",
        datasheet: new File([], ""),
      });
      console.log("data:");
      console.log(data);
    }
  }, [lobby]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar portaria</h1>
        {lobby && data ? (
          <LobbyUpdateForm preloadedValues={data} lobby={lobby} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
