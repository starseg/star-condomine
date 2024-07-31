"use client";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import {
  CalendarBlank,
  CalendarCheck,
  Car,
  DeviceMobileCamera,
  HouseLine,
  IdentificationCard,
  MagnifyingGlass,
  Notepad,
  PersonSimpleRun,
  SealWarning,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingIcon from "@/components/loadingIcon";
import { OpenDoorButton } from "@/components/control-id/device/openDoorButton";

interface CalendarProps {
  lobbyCalendarId: number;
  date: string;
  description: string;
}

export default function LobbyDetails() {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [calendar, setCalendar] = useState<CalendarProps[] | null>(null);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyId = params.get("id") || "";

  const fetchData = async () => {
    if (session)
      try {
        const path = "lobby/find/" + lobbyId;
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        if (response.data) {
          setLobby(response.data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const fetchCalendar = async () => {
    try {
      const path = "lobbyCalendar/today/" + lobbyId;
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      if (response.data) {
        setCalendar(response.data);
      }
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  let id = 0;
  let control = "";
  useEffect(() => {
    fetchData();
    fetchCalendar();
  }, [session]);
  if (lobby) {
    id = lobby.lobbyId;
    control = lobby.exitControl === "ACTIVE" ? "S" : "N";
  }
  return (
    <>
      <Menu url={`/dashboard`} />
      {lobby ? (
        <section className="max-w-5xl mx-auto mb-24">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl mt-2 text-primary mb-2 ml-10">
                Portaria: {lobby ? lobby.name : "Desconhecida"}
              </h1>
              <Link
                href={`actions/details?lobby=${id}`}
                className="flex justify-center gap-2 items-center text-xl mr-10 hover:underline hover:underline-offset-4"
              >
                <MagnifyingGlass />
                Detalhes
              </Link>
            </div>

            {calendar && calendar.length > 0 && (
              <p className="text-xl flex items-center gap-2 ml-10">
                <Warning size={32} className="text-red-500" /> Verifique as
                restrições do feriado de hoje no calendário
              </p>
            )}
          </div>
          <div className="mt-8 flex w-full flex-col flex-wrap items-center justify-center lg:flex-row gap-6">
            <Link
              href={`actions/access?lobby=${id}&c=${control}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <PersonSimpleRun />
              Acessos
            </Link>
            <Link
              href={`actions/scheduling?lobby=${id}&c=${control}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <CalendarCheck />
              Agendamentos
            </Link>
            <Link
              href={`actions/visitor?lobby=${id}&c=${control}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <IdentificationCard />
              Visitantes
            </Link>
            {lobby ? (
              lobby.type === "COMPANY" ? (
                <Link
                  href={`actions/employee?lobby=${id}&c=${control}`}
                  className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
                >
                  <HouseLine />
                  Funcionários
                </Link>
              ) : (
                <Link
                  href={`actions/resident?lobby=${id}&c=${control}`}
                  className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
                >
                  <HouseLine />
                  Moradores
                </Link>
              )
            ) : (
              ""
            )}
            <Link
              href={`actions/vehicle?lobby=${id}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <Car />
              Veículos
            </Link>
            <Link
              href={`actions/device?lobby=${id}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <DeviceMobileCamera />
              Dispositivos
            </Link>
            <Link
              href={`actions/problem?lobby=${id}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <SealWarning />
              Problemas
            </Link>
            <Link
              href={`actions/calendar?lobby=${id}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <CalendarBlank />
              Calendário
            </Link>
            <Link
              href={`actions/report?lobby=${id}&c=${control}`}
              className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
            >
              <Notepad />
              Relatórios
            </Link>
            {lobby.ControllerBrand.name === "Control iD" && (
              <Link
                href={`actions/control-id?lobby=${id}`}
                className="w-[300px] flex justify-center gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
              >
                Control iD
              </Link>
            )}
          </div>
          {lobby.ControllerBrand.name === "Control iD" && <OpenDoorButton />}
        </section>
      ) : (
        <div className="flex items-center justify-center my-8">
          <LoadingIcon />
        </div>
      )}
    </>
  );
}
