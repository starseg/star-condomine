"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";

export default function SchedulingDetails({ id }: { id: number }) {
  const [scheduling, setScheduling] = useState<Scheduling>();
  const { data: session } = useSession();
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("scheduling/find/" + id);
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
          <div className="md:border-primary mx-auto mt-4 px-12 py-4 md:border rounded-md max-w-2xl">
            <DetailItem
              label="Visitante"
              content={`${scheduling.visitor.name} - ${scheduling.visitor.visitorType.description}`}
            />
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

            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
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
        <div className="flex justify-center items-center w-full">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
