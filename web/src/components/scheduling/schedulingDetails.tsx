"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";

interface Scheduling {
  schedulingId: number;
  startDate: string;
  endDate: string;
  location: string;
  reason: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
}

export default function SchedulingDetails({ id }: { id: number }) {
  const [scheduling, setScheduling] = useState<Scheduling>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("scheduling/find/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setScheduling(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <div>
      {scheduling ? (
        <>
          <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md mt-4">
            <DetailItem label="Visitante" content={scheduling.visitor.name} />
            <DetailItem label="Visitado" content={scheduling.member.name} />
            <DetailItem
              label="Status"
              content={
                scheduling.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"
              }
            />
            <DetailItem
              label="Validade do acesso"
              content={
                simpleDateFormat(scheduling.startDate) +
                " - " +
                simpleDateFormat(scheduling.endDate)
              }
            />
            <DetailItem label="Local" content={scheduling.location} />
            <DetailItem label="Motivo" content={scheduling.reason} />
            <DetailItem
              label="Observações"
              content={scheduling.comments || "Nenhuma"}
            />

            <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
            <DetailItem
              label="Data do registro"
              content={formatDate(scheduling.createdAt)}
            />
            <DetailItem
              label="Última atualização"
              content={formatDate(scheduling.updatedAt)}
            />
            <DetailItem label="Operador" content={scheduling.operator.name} />
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
