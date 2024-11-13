"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { listLogsCommand } from "../device/commands";
import { eventLogs } from "./event-logs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import Image from "next/image";
import { addHours, format } from "date-fns";
import LoadingIcon from "@/components/loadingIcon";

export function AccessLogsLive() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const [devicesResponse, membersResponse, visitorsResponse] =
          await Promise.all([
            api.get(`/device/filtered/${lobby}?status=ACTIVE`),
            api.get(`member/lobby/${lobby}`),
            api.get(`visitor/lobby/${lobby}`),
          ]);

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
      return "";
    } else if (id <= 10_000) {
      return members.find((member) => member.memberId === id)?.profileUrl ?? "";
    } else if (id > 10_000) {
      return (
        visitors.find((visitor) => visitor.visitorId === id - 10_000)
          ?.profileUrl ?? ""
      );
    } else {
      return "";
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
      <SheetContent>
        <SheetHeader className="flex flex-col justify-between gap-6 mt-2 w-full">
          <div className="flex justify-between items-center w-full">
            <SheetTitle className="text-3xl">Acessos</SheetTitle>
          </div>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <>
              {accessLogs.length > 0 ? (
                <SheetDescription className="w-full max-h-[60vh] overflow-auto">
                  {accessLogs.map((log) => {
                    return (
                      <div key={log.id} className="">
                        <img
                          src={getUserPhotoById(log.user_id)}
                          alt=""
                          className="rounded-full max-w-16 aspect-square object-cover"
                        />
                        {getUserNameById(log.user_id)}
                        {format(
                          addHours(new Date(log.time * 1000), 3),
                          "dd/MM/yyyy"
                        )}
                        {format(
                          addHours(new Date(log.time * 1000), 3),
                          "HH:mm:ss"
                        )}
                        <div
                          style={{ color: `${eventLogs[log.event].color}` }}
                          className="font-bold"
                        >
                          {eventLogs[log.event].value}
                        </div>
                      </div>
                    );
                  })}
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
