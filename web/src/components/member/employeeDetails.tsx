"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate } from "@/lib/utils";

export default function EmployeeDetails({ id }: { id: number }) {
  const [member, setMember] = useState<Member>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("member/find/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setMember(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <div>
      {member ? (
        <>
          <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md mt-4">
            {member.profileUrl.length > 0 ? (
              <img
                src={member.profileUrl}
                width="150px"
                alt="Foto de perfil"
                className="mx-auto"
              />
            ) : (
              ""
            )}
            <DetailItem label="Nome" content={member.name} />
            <DetailItem
              label="Status"
              content={member.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            />
            <DetailItem label="CPF" content={member.cpf} />
            <DetailItem label="RG" content={member.rg} />
            <DetailItem label="Cargo" content={member.position} />
            <DetailItem
              label="Período de acesso"
              content={member.accessPeriod}
            />
            <DetailItem
              label="Observações"
              content={member.comments ? member.comments : "Nenhuma observação"}
            />

            <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
            <div className="flex flex-col justify-center gap-2 mb-4">
              <label className="text-lg">Formas de acesso:</label>
              {member.faceAccess === "true" ? (
                <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
                  Facial
                </p>
              ) : (
                ""
              )}
              {member.biometricAccess === "true" ? (
                <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
                  Biometria
                </p>
              ) : (
                ""
              )}
              {member.remoteControlAccess === "true" ? (
                <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
                  Controle remoto
                </p>
              ) : (
                ""
              )}
              {member.passwordAccess ? (
                <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
                  Senha: {member.passwordAccess}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
            <DetailItem
              label="Data do registro"
              content={formatDate(member.createdAt)}
            />
            <DetailItem
              label="Última atualização"
              content={formatDate(member.updatedAt)}
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
