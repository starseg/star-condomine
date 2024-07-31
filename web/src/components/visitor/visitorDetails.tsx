"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import MiniTable from "../miniTable";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { deleteAction } from "@/lib/delete-action";
import { useSearchParams } from "next/navigation";

export default function VisitorDetails({ id }: { id: number }) {
  const [visitor, setVisitor] = useState<VisitorFull>();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const fetchData = async () => {
    if (session)
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

  const deleteAccess = async (id: number) => {
    deleteAction(session, "acesso", `access/${id}`, fetchData);
  };
  const deleteScheduling = async (id: number) => {
    deleteAction(session, "agendamento", `scheduling/${id}`, fetchData);
  };

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
            <DetailItem
              label="Nome"
              content={visitor.name + " - " + visitor.visitorId.toString()}
            />
            <DetailItem
              label="Status"
              content={visitor.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
            />
            <DetailItem label="CPF/CNPJ" content={visitor.cpf} />
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

            {visitor.documentUrl && visitor.documentUrl.length > 0 ? (
              <>
                <p className="text-lg mb-2">Documento do proprietário</p>
                <img
                  src={visitor.documentUrl}
                  alt="Documento"
                  className="mx-auto"
                />
              </>
            ) : (
              ""
            )}

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
          {visitor.access && (
            <MiniTable title="Acessos" cols={["Entrada", "Saída", "Visitado"]}>
              {visitor.access.map((access) => (
                <div
                  key={access.accessId}
                  className="grid grid-cols-7 px-4 border-b border-stone-700 py-1"
                >
                  <p className="col-span-2">{formatDate(access.startTime)}</p>
                  <p className="col-span-2">
                    {access.endTime ? formatDate(access.endTime) : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                    {access.member.name}
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
          {visitor.scheduling && (
            <MiniTable
              title="Agendamentos"
              cols={["Início", "Fim", "Visitado"]}
            >
              {visitor.scheduling.map((scheduling) => (
                <div
                  key={scheduling.schedulingId}
                  className="grid grid-cols-7 px-4 border-b border-stone-700 py-1"
                >
                  <p className="col-span-2">
                    {simpleDateFormat(scheduling.startDate)}
                  </p>
                  <p className="col-span-2">
                    {scheduling.endDate
                      ? simpleDateFormat(scheduling.endDate)
                      : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                    {scheduling.member.name}
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
