"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import Card from "./card";
import { AccessesByLobbyChart } from "./charts/accessesByLobbyChart";
import { AccessesByOperatorChart } from "./charts/accessesByOperatorChart";
import { AccessesByVisitorTypeChart } from "./charts/accessesByVisitorTypeChart";
import { AccessesPerHourChart } from "./charts/accessesPerHourChart";
import { ExitsPerHourChart } from "./charts/exitsPerHourChart";
import { LogsByOperatorChart } from "./charts/logsByOperatorChart";
import { ProblemChart } from "./charts/problemChart";
import { ProblemsByLobbyChart } from "./charts/problemsByLobbyChart";
import { SchedulingsByLobbyChart } from "./charts/schedulingsByLobbyChart";
import { SelectDateRange } from "./selectDateRange";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { generatePDF } from "./generatePDF";

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

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const from = params.get("from");
  const to = params.get("to");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let date = "";
        if (!from || !to) {
          date = "";
        } else {
          date = `?from=${from}&to=${to}`;
        }
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
          api.get("generalData/count" + date),
          api.get("generalData/accessesByLobby" + date),
          api.get("generalData/accessesByOperator" + date),
          api.get("generalData/problemsByLobby" + date),
          api.get("generalData/countAccessesPerHour" + date),
          api.get("generalData/countExitsPerHour" + date),
          api.get("generalData/schedulingsByLobby" + date),
          api.get("generalData/accessesByVisitorType" + date),
          api.get("generalData/logsByOperator" + date),
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
  }, [session, from, to]);

  return (
    <div className="mt-8" id="dashboard">
      {counts &&
      problemsByLobby &&
      accessesByLobby &&
      accessesByVisitorType &&
      accessesByOperator &&
      logsByOperator &&
      accessesPerHour &&
      exitsPerHour ? (
        <>
          <SelectDateRange />
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
            {/* <Button onClick={generatePDF}>Baixar PDF</Button> */}
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
