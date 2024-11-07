"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function AccessDetails({ id }: { id: number }) {
  const [access, setAccess] = useState<Access>();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const control = params.get("c");
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("access/find/" + id)
        setAccess(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <div>
      {access ? (
        <>
          <div className="border-primary mx-auto mt-4 px-12 py-4 border rounded-md max-w-2xl">
            <DetailItem
              label="Visitante"
              content={`${access.visitor.name} - ${access.visitor.visitorType.description}`}
            />
            <DetailItem label="Visitado" content={access.member.name} />
            <DetailItem
              label="Status"
              content={access.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            />
            <DetailItem
              label="Data de entrada"
              content={formatDate(access.startTime)}
            />
            {control === "S" ? (
              <DetailItem
                label="Data de saída"
                content={
                  access.endTime ? formatDate(access.endTime) : "Não saiu"
                }
              />
            ) : (
              ""
            )}
            <DetailItem label="Local" content={access.local ? access.local : "Não Informado"} />
            <DetailItem label="Motivo" content={access.reason ? access.reason : "Não Informado"} />
            <DetailItem
              label="Observações"
              content={access.comments ? access.comments : "Sem observações"}
            />

            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
            <DetailItem
              label="Data do registro"
              content={formatDate(access.createdAt)}
            />
            <DetailItem
              label="Última atualização"
              content={formatDate(access.updatedAt)}
            />
            <DetailItem label="Operador" content={access.operator.name} />
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
