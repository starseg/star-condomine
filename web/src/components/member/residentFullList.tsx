"use client";
import api from "@/lib/axios";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Label } from "../ui/label";

export default function ResidentFullList({ lobby }: { lobby: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "member/lobby/" + lobby;
        } else {
          path = `member/filtered/${lobby}?query=${params.get("query")}`;
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

  const orderByDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSorted(event.target.checked);
    if (event.target.checked) {
      setMembers((prevMembers) =>
        [...prevMembers].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else {
      fetchData();
    }
  };

  return (
    <>
      <section className="max-h-[60vh] overflow-x-auto mb-4">
        {members.map((member) => (
          <div
            key={member.memberId}
            className="bg-stone-850 my-2 border border-primary rounded-md p-4 flex gap-6 items-center"
          >
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
              <p>E-mail: {member.email}</p>
            </div>
            <div className="flex flex-col gap-1 font-bold">
              <p className="flex gap-2 items-center">
                Telefone:{" "}
                {member.telephone.map((tel) => (
                  <span
                    key={tel.telephoneId}
                    className="p-1 bg-stone-700 rounded-md"
                  >
                    {tel.number}
                  </span>
                ))}
              </p>
              <p>
                Endereço:{" "}
                {member.addressType.description + " " + member.address}
              </p>
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
      <div className="flex gap-2 items-center p-2">
        <input type="checkbox" checked={isSorted} onChange={orderByDate} />
        <Label>Ordenar por data de registro</Label>
      </div>
    </>
  );
}
