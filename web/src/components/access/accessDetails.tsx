"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";

interface Access {
  accessId: number;
  startTime: string;
  endTime: string;
  local: string;
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

export default function AccessDetails({ id }: { id: number }) {
  const [access, setAccess] = useState<Access>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("access/find/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
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
          <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md">
            <DetailItem label="Visitante" content={access.visitor.name} />
            <DetailItem label="Visitado" content={access.member.name} />
            <DetailItem
              label="Status"
              content={access.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            />
            <DetailItem
              label="Data de entrada"
              content={simpleDateFormat(access.startTime)}
            />
            <DetailItem
              label="Data de saída"
              content={
                access.endTime ? simpleDateFormat(access.endTime) : "Não saiu"
              }
            />
            <DetailItem label="Local" content={access.local} />
            <DetailItem label="Motivo" content={access.reason} />
            <DetailItem label="Observações" content={access.comments} />

            <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
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
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
