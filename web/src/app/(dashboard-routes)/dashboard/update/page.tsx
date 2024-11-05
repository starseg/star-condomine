"use client";
import LoadingIcon from "@/components/loadingIcon";
import { LobbyUpdateForm } from "@/components/lobby/lobbyUpdateForm";
import api from "@/lib/axios";
import { Menu } from "@/components/menu";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateLobby() {
  interface Values {
    type: "CONDOMINIUM" | "COMPANY" | undefined;
    exitControl: "ACTIVE" | "INACTIVE" | undefined;
    protection: "ACTIVE" | "INACTIVE" | undefined;
    cnpj: string;
    name: string;
    responsible: string;
    telephone: string;
    schedules: string;
    procedures: string;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    datasheet: File;
    code: string;
    brand: number;
  }

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [data, setData] = useState<Values>();

  useEffect(() => {
    const fetchData = async () => {
      if (session)
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
        exitControl: lobby?.exitControl || "ACTIVE",
        protection: lobby?.protection || "INACTIVE",
        cnpj: lobby?.cnpj || "",
        name: lobby?.name || "",
        responsible: lobby?.responsible || "",
        telephone: lobby?.telephone || "",
        schedules: lobby?.schedules || "",
        procedures: lobby?.procedures || "",
        cep: lobby?.cep || "",
        state: lobby?.state || "",
        city: lobby?.city || "",
        neighborhood: lobby?.neighborhood || "",
        street: lobby?.street || "",
        number: lobby?.number || "",
        complement: lobby?.complement || "",
        datasheet: new File([], ""),
        code: lobby?.code?.toString() || "",
        brand: lobby?.controllerBrandId || 0,
      });
    }
  }, [lobby]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="mt-2 mb-4 text-4xl">Atualizar portaria</h1>
        {lobby && data ? (
          <LobbyUpdateForm preloadedValues={data} lobby={lobby} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
