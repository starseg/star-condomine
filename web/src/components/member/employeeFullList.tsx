"use client";
import api from "@/lib/axios";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  accessPeriod: string;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
}

export default function ResidentFullList({ lobby }: { lobby: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fetchData = async () => {
    const params = new URLSearchParams(searchParams);
    try {
      let path;
      if (!params.get("query")) {
        path = "member/lobby/" + lobby;
        // console.log(path);
      } else {
        path = `member/filtered/${lobby}?query=${params.get("query")}`;
        // console.log(path);
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  return (
    <section>
      {members.map((member) => (
        <div className="bg-stone-850 my-2 border border-primary rounded-md p-4 flex gap-6 items-center">
          {member.profileUrl ? (
            <img
              src={member.profileUrl}
              alt="Foto"
              className="aspect-auto max-h-20 max-w-20"
            />
          ) : (
            <UserCircle className="w-20 h-20" />
          )}
          <div className="flex flex-col gap-1 font-bold">
            <p>ID: {member.memberId}</p>
            <p>{member.name}</p>
            <p>
              Status: {member.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            </p>
            <p>CPF: {member.cpf}</p>
            <p>RG: {member.rg}</p>
            <p>Cargo: {member.position}</p>
          </div>
          <div className="flex flex-col gap-1 font-bold">
            <p>Período de acesso: {member.accessPeriod}</p>
            <p>Comentários: {member.comments}</p>
            <p className="flex gap-2 items-center">
              Formas de acesso:{" "}
              {member.faceAccess === "true" && (
                <span className="p-1 bg-stone-700 rounded-md">facial</span>
              )}{" "}
              {member.biometricAccess === "true" && (
                <span className="p-1 bg-stone-700 rounded-md">biometria</span>
              )}
              {member.remoteControlAccess === "true" && (
                <span className="p-1 bg-stone-700 rounded-md">
                  controle remoto
                </span>
              )}
              {member.passwordAccess === "true" && (
                <span className="p-1 bg-stone-700 rounded-md">
                  senha ({member.passwordAccess})
                </span>
              )}
            </p>
            <p>Data de registro: {formatDate(member.createdAt)}</p>
            <p>Última atualização: {formatDate(member.updatedAt)}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
