"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import Card from "./card";

export default function ManagementPanel() {
  const [counts, setCounts] = useState<GeneralCounts>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("generalData/count", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setCounts(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <div className="mt-8">
      {counts ? (
        <>
          {/* GRÁFICOS */}
          <div></div>
          {/* COUNTS */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Card title="Portarias" content={counts.lobbies} />
            <Card title="Proprietários" content={counts.members} />
            <Card title="Visitantes" content={counts.visitors} />
            <Card title="Acessos" content={counts.accesses} />
            <Card title="Agendamentos" content={counts.schedulings} />
            <Card title="Veículos" content={counts.vehicles} />
            <Card title="Dispositivos" content={counts.devices} />
            <Card title="Problemas" content={counts.problems} />
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
