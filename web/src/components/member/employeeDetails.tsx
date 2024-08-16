"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";
import DetailItem from "../detailItem";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import MiniTable from "../miniTable";
import {
  Check,
  PencilLine,
  Trash,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { deleteAction } from "@/lib/delete-action";
import { Button } from "../ui/button";
import { GetUserByIdCommand } from "../control-id/device/commands";

interface User {
  id: number;
  registration: string;
  name: string;
  password: string;
  salt: string;
  expires: number;
  user_type_id: number;
  begin_time: number;
  end_time: number;
  image_timestamp: number;
}

export default function EmployeeDetails({ id }: { id: number }) {
  const [member, setMember] = useState<MemberFull>();
  const [lobbyData, setLobbyData] = useState<Lobby>();
  const [userResult, setUserResult] = useState<User>();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const control = params.get("c");
  const fetchData = async () => {
    if (session)
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
  async function fetchLobbyData() {
    if (session)
      try {
        const getLobby = await api.get(`/lobby/find/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setLobbyData(getLobby.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }
  useEffect(() => {
    fetchData();
    fetchLobbyData();
  }, [session]);

  const deleteAccess = async (id: number) => {
    deleteAction(session, "acesso", `access/${id}`, fetchData);
  };
  const deleteScheduling = async (id: number) => {
    deleteAction(session, "agendamento", `scheduling/${id}`, fetchData);
  };

  async function sendControliDCommand(command: object): Promise<void> {
    try {
      if (lobbyData && lobbyData.ControllerBrand.name === "Control iD") {
        lobbyData.device.map(async (device) => {
          await api.post(`/control-id/add-command?id=${device.name}`, command);
        });
        console.log("Command sent successfully");
      } else {
        console.log("Não é uma portaria com Control iD");
      }
    } catch (error) {
      console.error("Error sending command:", error);
    }
  }

  async function fetchResults(): Promise<void> {
    try {
      const response = await api.get("/control-id/results");
      console.log(response.data);
      if (response.data.length > 0) {
        const user = JSON.parse(
          response.data[response.data.length - 1].response
        );
        if (user.users[0].id === id) setUserResult(user.users[0]);
        else console.log("User not found, try again");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  async function searchUser(id: number) {
    await sendControliDCommand(GetUserByIdCommand(id));
    await fetchResults();
  }

  return (
    <div>
      {member ? (
        <>
          <div className="border-primary mx-auto mt-4 px-12 py-4 border rounded-md max-w-2xl">
            <div className="flex justify-center items-center gap-4 w-full">
              {member.profileUrl.length > 0 ? (
                <img
                  src={member.profileUrl}
                  width="150px"
                  alt="Foto de perfil"
                  className="rounded"
                />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <UserCircle className="w-20 h-20" />
                  <p>sem foto</p>
                </div>
              )}
              {member.MemberGroup.length > 0 && (
                <div className="flex flex-col gap-4 p-4 border rounded">
                  <p>Vinculado a: {member.MemberGroup[0].group.name}</p>
                  <Button onClick={() => searchUser(member.memberId)}>
                    Confirmar vinculação nas leitoras
                  </Button>
                  {userResult && (
                    <div className="flex gap-2">
                      <Check className="text-green-400 text-xl" /> confirmado
                    </div>
                  )}
                </div>
              )}
            </div>
            <DetailItem
              label="Nome"
              content={member.name + " - " + member.memberId.toString()}
            />
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

            {member.documentUrl && member.documentUrl.length > 0 ? (
              <>
                <p className="mb-2 text-lg">Documento</p>
                <img
                  src={member.documentUrl}
                  alt="Documento"
                  className="mx-auto"
                />
              </>
            ) : (
              ""
            )}

            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
            <div className="flex flex-col justify-center gap-2 mb-4">
              <label className="text-lg">Formas de acesso:</label>
              {member.faceAccess === "true" ? (
                <p className="bg-muted px-4 py-1 rounded-md text-muted-foreground">
                  Facial
                </p>
              ) : (
                ""
              )}
              {member.biometricAccess === "true" ? (
                <p className="bg-muted px-4 py-1 rounded-md text-muted-foreground">
                  Biometria
                </p>
              ) : (
                ""
              )}
              {member.remoteControlAccess === "true" ? (
                <p className="bg-muted px-4 py-1 rounded-md text-muted-foreground">
                  Controle remoto
                </p>
              ) : (
                ""
              )}
              {member.passwordAccess ? (
                <p className="bg-muted px-4 py-1 rounded-md text-muted-foreground">
                  Senha: {member.passwordAccess}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
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
                <div
                  key={access.accessId}
                  className="border-stone-700 grid grid-cols-7 px-4 py-1 border-b"
                >
                  <p className="col-span-2">{formatDate(access.startTime)}</p>
                  <p className="col-span-2">
                    {access.endTime ? formatDate(access.endTime) : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis whitespace-nowrap overflow-hidden">
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
                <div
                  key={scheduling.schedulingId}
                  className="border-stone-700 grid grid-cols-7 px-4 py-1 border-b"
                >
                  <p className="col-span-2">
                    {simpleDateFormat(scheduling.startDate)}
                  </p>
                  <p className="col-span-2">
                    {scheduling.endDate
                      ? simpleDateFormat(scheduling.endDate)
                      : "Não saiu"}
                  </p>
                  <p className="col-span-2 max-w-[15ch] text-ellipsis whitespace-nowrap overflow-hidden">
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
        <div className="flex justify-center items-center w-full">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
