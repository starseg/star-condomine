"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import Card from "./card";
import { ProblemChart } from "./charts/problemChart";
import { AccessesByLobbyChart } from "./charts/accessesByLobbyChart";
import { ProblemsByLobbyChart } from "./charts/problemsByLobbyChart";
import { AccessesByOperatorChart } from "./charts/accessesByOperatorChart";
import { AccessesPerHourChart } from "./charts/accessesPerHourChart";
import { ExitsPerHourChart } from "./charts/exitsPerHourChart";
import { SchedulingsByLobbyChart } from "./charts/schedulingsByLobbyChart";
import { AccessesByVisitorTypeChart } from "./charts/accessesByVisitorTypeChart";
import { LogsByOperatorChart } from "./charts/logsByOperatorChart";

export default function ManagementPanel() {
  const [counts, setCounts] = useState<GeneralCounts>();
  const [accessesByLobby, setAccessesByLobby] = useState<
    AccessByLobbyChartProps[]
  >([]);
  const [accessesByOperator, setAccessesByOperator] = useState<
    AccessByOperatorChartProps[]
  >([]);
  const [problemsByLobby, setProblemsByLobby] = useState<
    AccessByLobbyChartProps[]
  >([]);
  const [accessesPerHour, setAccessesPerHour] =
    useState<AccessPerHourChartProps>();
  const [exitsPerHour, setExitsPerHour] = useState<AccessPerHourChartProps>();
  const [schedulingsByLobby, setSchedulingsByLobby] = useState<
    AccessByLobbyChartProps[]
  >([]);
  const [accessesByVisitorType, setAccessesByVisitorType] = useState<
    AccessByVisitorTypeChartProps[]
  >([]);
  const [logsByOperator, setLogsByOperator] = useState<
    LogsByOperatorChartProps[]
  >([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          countResponse,
          accessesByLobbyResponse,
          accessesByOperatorResponse,
          problemsByLobbyResponse,
          accessesPerHourResponse,
          exitsPerHourResponse,
          schedulingsByLobbyResponse,
          accessesByVisitorTypeResponse,
          logsByOperatorResponse,
        ] = await Promise.all([
          api.get("generalData/count"),
          api.get("generalData/accessesByLobby"),
          api.get("generalData/accessesByOperator"),
          api.get("generalData/problemsByLobby"),
          api.get("generalData/countAccessesPerHour"),
          api.get("generalData/countExitsPerHour"),
          api.get("generalData/schedulingsByLobby"),
          api.get("generalData/accessesByVisitorType"),
          api.get("generalData/logsByOperator"),
        ]);

        // Definindo os estados após as respostas
        setCounts(countResponse.data);
        setAccessesByLobby(accessesByLobbyResponse.data);
        setAccessesByOperator(accessesByOperatorResponse.data);
        setProblemsByLobby(problemsByLobbyResponse.data);
        setAccessesPerHour(accessesPerHourResponse.data);
        setExitsPerHour(exitsPerHourResponse.data);
        setSchedulingsByLobby(schedulingsByLobbyResponse.data);
        setAccessesByVisitorType(accessesByVisitorTypeResponse.data);
        setLogsByOperator(logsByOperatorResponse.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };
    // Chama a função fetchData quando a sessão muda
    fetchData();
  }, [session]);

  return (
    <div className="mt-8">
      {counts &&
      problemsByLobby &&
      accessesByLobby &&
      accessesByVisitorType &&
      accessesByOperator &&
      logsByOperator &&
      accessesPerHour &&
      exitsPerHour ? (
        <>
          {/* COUNTS */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Card title="Portarias" content={counts.lobbies} />
            <Card title="Proprietários" content={counts.members} />
            <Card title="Visitantes" content={counts.visitors} />
            <Card title="Acessos" content={counts.accesses} />
            <Card title="Agendamentos" content={counts.schedulings} />
            <Card title="Veículos" content={counts.vehicles} />
            <Card title="Dispositivos" content={counts.devices} />
            <Card title="Problemas" content={counts.problems} />
          </div>
          {/* GRÁFICOS */}
          <div className="flex flex-col justify-center items-center gap-4 mt-8">
            <div className="flex justify-center items-center gap-4">
              <ProblemChart
                total={counts.problems}
                solved={counts.solvedProblems}
              />
              <ProblemsByLobbyChart {...problemsByLobby} />
            </div>
            <AccessesByLobbyChart {...accessesByLobby} />
            <AccessesByOperatorChart {...accessesByOperator} />
            <AccessesPerHourChart {...accessesPerHour} />
            <ExitsPerHourChart {...exitsPerHour} />
            <SchedulingsByLobbyChart {...schedulingsByLobby} />
            <AccessesByVisitorTypeChart {...accessesByVisitorType} />
            <LogsByOperatorChart {...logsByOperator} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
