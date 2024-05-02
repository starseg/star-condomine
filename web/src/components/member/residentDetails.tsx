"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import { deleteAction } from "@/lib/delete-action";
import { useSearchParams } from "next/navigation";
import MiniTable from "../miniTable";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function residentDetails({ id }: { id: number }) {
  const [member, setMember] = useState<MemberFull>();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
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

  const deleteAccess = async (id: number) => {
    deleteAction(session, "acesso", `access/${id}`, fetchData);
  };
  const deleteScheduling = async (id: number) => {
    deleteAction(session, "agendamento", `scheduling/${id}`, fetchData);
  };

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
            <DetailItem label="E-mail" content={member.email} />
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
          {member.access && (
            <MiniTable title="Acessos" cols={["Entrada", "Saída", "Visitante"]}>
              {member.access.map((access) => (
                <div className="grid grid-cols-7 px-4 border-b border-stone-700 py-1">
                  <p className="col-span-2">{formatDate(access.startTime)}</p>
                  <p className="col-span-2">
                    {access.endTime ? formatDate(access.endTime) : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                    {access.visitor.name}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      title="Excluir"
                      onClick={() => deleteAccess(access.accessId)}
                    >
                      <Trash size={24} />
                    </button>
                    <Link
                      href={`/dashboard/actions/access/update?lobby=${access.lobbyId}&id=${access.accessId}&c=${control}`}
                    >
                      <PencilLine size={24} />
                    </Link>
                  </div>
                </div>
              ))}
            </MiniTable>
          )}
          {member.scheduling && (
            <MiniTable
              title="Agendamentos"
              cols={["Início", "Fim", "Visitante"]}
            >
              {member.scheduling.map((scheduling) => (
                <div className="grid grid-cols-7 px-4 border-b border-stone-700 py-1">
                  <p className="col-span-2">
                    {simpleDateFormat(scheduling.startDate)}
                  </p>
                  <p className="col-span-2">
                    {scheduling.endDate
                      ? simpleDateFormat(scheduling.endDate)
                      : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                    {scheduling.visitor.name}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      title="Excluir"
                      onClick={() => deleteScheduling(scheduling.schedulingId)}
                    >
                      <Trash size={24} />
                    </button>
                    <Link
                      href={`/dashboard/actions/scheduling/update?lobby=${scheduling.lobbyId}&id=${scheduling.schedulingId}`}
                    >
                      <PencilLine size={24} />
                    </Link>
                  </div>
                </div>
              ))}
            </MiniTable>
          )}
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
