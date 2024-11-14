"use client";
import LoadingIcon from "@/components/loadingIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/lib/axios";
import { addHours, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listLogsCommand } from "../device/commands";
import { eventLogs } from "./event-logs";

export function AccessLogsLive() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedLobby, setLoggedLobby] = useState<Lobby | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  async function searchAccessLogs() {
    devices.map(async (device) => {
      await api.post(
        `/control-id/add-command?id=${device.name}`,
        listLogsCommand
      );
    });
    await new Promise((resolve) => {
      setTimeout(async () => {
        fetchResults();
        resolve(true);
      }, 5000);
    });
  }

  async function fetchResults() {
    const response = await api.get("/control-id/results");
    if (!response.data.length) {
      toast.error(
        "Ocorreu um erro ao obter os registros de acesso, verifique se o dispositivo está conectado e tente novamente."
      );
      setAccessLogs([]);
      return;
    }

    const lastResult = response.data[response.data.length - 1].body.response;

    try {
      const accessLogs = JSON.parse(lastResult);
      setAccessLogs(accessLogs.access_logs.reverse().slice(0, 20));
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      toast.error("Ocorreu um erro ao obter os registros de acesso.");
    }
    setIsLoading(false);
  }

  const fetchData = async () => {
    if (session) {
      try {
        const [
          devicesResponse,
          membersResponse,
          visitorsResponse,
          lobbyResponse,
        ] = await Promise.all([
          api.get(`/device/filtered/${lobby}?status=ACTIVE`),
          api.get(`member/lobby/${lobby}`),
          api.get(`visitor/lobby/${lobby}`),
          api.get(`/lobby/find/${lobby}`),
        ]);

        setLoggedLobby(lobbyResponse.data);
        setDevices(devicesResponse.data);
        setMembers(membersResponse.data);
        setVisitors(visitorsResponse.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    }
  };

  function getUserNameById(id: number) {
    if (id === 0) {
      return "Usuário não identificado";
    } else if (id <= 10_000) {
      return (
        members.find((member) => member.memberId === id)?.name ??
        "Usuário não encontrado"
      );
    } else if (id > 10_000) {
      return (
        visitors.find((visitor) => visitor.visitorId === id - 10_000)?.name ??
        "Usuário não encontrado"
      );
    } else {
      return "Usuário não encontrado";
    }
  }

  function getUserPhotoById(id: number) {
    if (id === 0) {
      return;
    } else if (id <= 10_000) {
      return members.find((member) => member.memberId === id)?.profileUrl;
    } else if (id > 10_000) {
      return visitors.find((visitor) => visitor.visitorId === id - 10_000)
        ?.profileUrl;
    } else {
      return;
    }
  }

  useEffect(() => {
    fetchData();
  }, [session]);

  useEffect(() => {
    if (isOpen) {
      const intervalId = setInterval(() => {
        searchAccessLogs();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isOpen, session]);

  const handleDialogOpen = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleDialogOpen}>
      <SheetTrigger asChild>
        <button className="right-8 bottom-8 fixed flex justify-center items-center bg-primary hover:bg-primary/80 p-2 rounded-full w-16 h-16 text-stone-950 transition-colors">
          Acessos
        </button>
      </SheetTrigger>
      <SheetContent
        className="min-w-[40%]"
        aria-description="Ultimos acessos das leitoras faciais"
      >
        <SheetHeader className="flex flex-col justify-between gap-6 mt-2 w-full">
          <div className="flex flex-col -mb-3 w-full">
            <SheetTitle className="text-3xl text-primary">
              Acessos Recentes
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2 text-muted-foreground text-sm">
              Relatório dos últimos 20 acessos dos dispositivos da portaria{" "}
              {loggedLobby?.name}
            </SheetDescription>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoadingIcon />
            </div>
          ) : (
            <>
              {accessLogs.length > 0 ? (
                <SheetDescription className="pb-4 w-full max-h-[80vh] overflow-auto">
                  <div className="flex flex-col h-full">
                    {accessLogs.map((log, index) => {
                      return (
                        <div className="flex flex-col gap-2">
                          <div key={log.id} className="flex items-center gap-3">
                            <div
                              className="flex flex-col"
                              style={{
                                marginTop: index !== 0 ? "24px" : "0",
                                color: `${eventLogs[log.event].color}`,
                              }}
                            >
                              <span>
                                {format(
                                  addHours(new Date(log.time * 1000), 3),
                                  "dd/M/yyyy",
                                  { locale: ptBR }
                                )}
                              </span>
                              <span>
                                {format(
                                  addHours(new Date(log.time * 1000), 3),
                                  "HH:mm:ss",
                                  { locale: ptBR }
                                )}
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              {index !== 0 && (
                                <div className="bg-muted-foreground w-[2px] h-6"></div>
                              )}
                              <img
                                src={
                                  getUserPhotoById(log.user_id) ||
                                  "/user-null.jpg"
                                }
                                alt=""
                                className="rounded-full max-w-12 aspect-square object-cover"
                              />
                            </div>

                            <div
                              className="flex flex-col gap-2"
                              style={{ marginTop: index !== 0 ? "24px" : "0" }}
                            >
                              <span className="text-foreground text-pretty">
                                {getUserNameById(log.user_id)}{" "}
                                {log.user_id === 0
                                  ? ""
                                  : log.user_id <= 10_000
                                  ? loggedLobby?.type === "CONDOMINIUM"
                                    ? "- Morador"
                                    : "- Funcionário"
                                  : "- Visitante"}
                              </span>
                              <div>
                                <span
                                  style={{
                                    color: `${eventLogs[log.event].color}`,
                                  }}
                                  className="font-bold text-pretty"
                                >
                                  {eventLogs[log.event].value}
                                </span>
                                <span> - </span>
                                <span>
                                  {format(
                                    addHours(new Date(log.time * 1000), 3),
                                    "HH:mm:ss",
                                    { locale: ptBR }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SheetDescription>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2 h-svh">
                  <Image
                    src="/undraw_location_search.svg"
                    alt="Sem registros"
                    width={982 / 2}
                    height={763 / 2}
                  />
                  <p className="font-bold">Não há nenhum dado a ser exibido.</p>
                </div>
              )}
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
