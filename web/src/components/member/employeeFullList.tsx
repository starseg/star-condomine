"use client";
import api from "@/lib/axios";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function ResidentFullList({ lobby }: { lobby: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "member/lobby/" + lobby;
        } else {
          path = `member/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path);
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
          {member.documentUrl && member.documentUrl.length > 0 && (
            <div className="w-1/4">
              <p className="text-lg mb-2">Documento</p>
              <img
                src={member.documentUrl}
                alt="Documento"
                className="mx-auto"
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
