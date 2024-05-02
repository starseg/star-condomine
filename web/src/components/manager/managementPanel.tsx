"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import Card from "./card";
import {
  AccessesByLobbyChart,
  ProblemByLobbyChart,
  ProblemChart,
} from "./charts";

export default function ManagementPanel() {
  const [counts, setCounts] = useState<GeneralCounts>();
  const [accessesByLobby, setAccessesByLobby] = useState<
    AccessByLobbyChartProps[]
  >([]);
  const [problemsByLobby, setProblemsByLobby] = useState<
    AccessByLobbyChartProps[]
  >([]);
  const { data: session } = useSession();
  const fetchCount = async () => {
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
  const fetchAccessesByLobby = async () => {
    try {
      const response = await api.get("generalData/accessesByLobby", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setAccessesByLobby(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const fetchProblemsByLobby = async () => {
    try {
      const response = await api.get("generalData/problemsByLobby", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setProblemsByLobby(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchCount();
    fetchAccessesByLobby();
    fetchProblemsByLobby();
  }, [session]);

  return (
    <div className="mt-8">
      {counts && problemsByLobby && accessesByLobby ? (
        <>
          {/* GRÁFICOS */}
          <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <div className="flex gap-4 justify-center items-center">
              <ProblemChart
                total={counts.problems}
                solved={counts.solvedProblems}
              />
              <ProblemByLobbyChart {...problemsByLobby} />
            </div>
            <AccessesByLobbyChart {...accessesByLobby} />
          </div>
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
