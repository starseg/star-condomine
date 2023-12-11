"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate } from "@/lib/utils";

interface Member {
  memberId: number;
  type: string;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  comments: string;
  status: string;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: Date;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
}

export default function memberDetails({ id }: { id: number }) {
  const router = useRouter();
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
        <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md">
          <DetailItem label="Nome" content={member.name} />
          <DetailItem label="CPF" content={member.cpf} />
          <DetailItem label="RG" content={member.rg} />
          <DetailItem label="email" content={member.email} />
          <div className="flex flex-col justify-center gap-2 mb-4">
            <label className="text-lg">Telefone:</label>

            {member.telephone
              ? member.telephone.length > 0
                ? member.telephone.map((telephone) => (
                    <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
                      {telephone.number}
                    </p>
                  ))
                : "Nenhum telefone cadastrado"
              : "Sem telefone"}
          </div>
          <DetailItem
            label="Endereço"
            content={
              member.address
                ? member.addressType.description + " " + member.address
                : "Endereço não cadastrado"
            }
          />
          <DetailItem
            label="Comentários"
            content={member.comments ? member.comments : "Nenhum comentário"}
          />
          <DetailItem
            label="Status"
            content={member.status === "ACTIVE" ? "Ativo" : "Inativo"}
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
      ) : (
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
