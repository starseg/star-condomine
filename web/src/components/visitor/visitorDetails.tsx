"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate } from "@/lib/utils";

export default function VisitorDetails({ id }: { id: number }) {
  const [visitor, setVisitor] = useState<Visitor>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("visitor/find/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVisitor(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <div>
      {visitor ? (
        <>
          <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md mt-4">
            {visitor.profileUrl.length > 0 ? (
              <img
                src={visitor.profileUrl}
                width="150px"
                alt="Foto de perfil"
                className="mx-auto"
              />
            ) : (
              ""
            )}
            <DetailItem label="Nome" content={visitor.name} />
            <DetailItem
              label="Status"
              content={visitor.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            />
            <DetailItem label="CPF" content={visitor.cpf} />
            <DetailItem label="RG" content={visitor.rg} />
            <DetailItem label="Telefone" content={visitor.phone} />

            <DetailItem
              label="Tipo de visitante"
              content={visitor.visitorType.description}
            />
            <DetailItem label="Relação" content={visitor.relation} />
            <DetailItem
              label="Observações"
              content={visitor.comments ? visitor.comments : "Sem observações"}
            />

            <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
            <DetailItem
              label="Data do registro"
              content={formatDate(visitor.createdAt)}
            />
            <DetailItem
              label="Última atualização"
              content={formatDate(visitor.updatedAt)}
            />
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
