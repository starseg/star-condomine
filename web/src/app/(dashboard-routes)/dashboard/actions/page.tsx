"use client";
import { AccessLogsLive } from "@/components/control-id/access-logs/accessLogsLive";
import { OpenDoorButton } from "@/components/control-id/device/openDoorButton";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import {
  CalendarBlank,
  CalendarCheck,
  Car,
  DeviceMobileCamera,
  Gear,
  HouseLine,
  IdentificationCard,
  MagnifyingGlass,
  Notepad,
  PersonSimpleRun,
  ScanSmiley,
  SealWarning,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const params = new URLSearchParams(searchParams.toString());
  const lobbyId = params.get("lobby") || "";

  const fetchData = async () => {
    if (session)
      try {
        const path = "lobby/find/" + lobbyId;
        const response = await api.get(path);
        if (response.data) {
          setLobby(response.data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const fetchCalendar = async () => {
    if (session)
      try {
        const path = "lobbyCalendar/today/" + lobbyId;
        const response = await api.get(path);
        if (response.data) {
          setCalendar(response.data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  let id = 0;
  let control = "";
  let brand = "";
  useEffect(() => {
    fetchData();
    fetchCalendar();
  }, [session]);
  if (lobby) {
    id = lobby.lobbyId;
    control = lobby.exitControl === "ACTIVE" ? "S" : "N";
    brand = lobby.ControllerBrand.name.replace(" ", "-");
  }
  return (
    <>
      <Menu url={`/dashboard`} />
      {lobby ? (
        <section className="mx-auto mb-24 max-w-5xl">
          <div>
            <div className="flex justify-between items-start md:items-center">
              <h1 className="mt-2 mb-2 ml-10 text-4xl text-primary">
                Portaria: <br className="md:hidden" />{" "}
                {lobby ? lobby.name : "Desconhecida"}
              </h1>
              <Link
                href={`actions/details?lobby=${id}`}
                className="flex justify-center items-center gap-2 mr-10 text-xl hover:underline hover:underline-offset-4"
              >
                <MagnifyingGlass />
                Detalhes
              </Link>
            </div>

            {calendar && calendar.length > 0 && (
              <p className="flex items-center gap-2 ml-10 text-xl">
                <Warning size={32} className="text-red-500" /> Verifique as
                restrições do feriado de hoje no calendário
              </p>
            )}
          </div>
          <div className="flex lg:flex-row flex-col flex-wrap justify-center items-center gap-6 mt-8 w-full">
            <Link
              href={`actions/access?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <PersonSimpleRun />
              Acessos
            </Link>
            <Link
              href={`actions/scheduling?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <CalendarCheck />
              Agendamentos
            </Link>
            <Link
              href={`actions/visitor?lobby=${id}&c=${control}&brand=${brand}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <IdentificationCard />
              Visitantes
            </Link>
            {lobby ? (
              lobby.type === "COMPANY" ? (
                <Link
                  href={`actions/employee?lobby=${id}&c=${control}&brand=${brand}`}
                  className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                >
                  <HouseLine />
                  Funcionários
                </Link>
              ) : (
                <Link
                  href={`actions/resident?lobby=${id}&c=${control}&brand=${brand}`}
                  className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
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
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <Car />
              Veículos
            </Link>
            <Link
              href={`actions/device?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <DeviceMobileCamera />
              Dispositivos
            </Link>
            <Link
              href={`actions/problem?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <SealWarning />
              Problemas
            </Link>
            <Link
              href={`actions/calendar?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <CalendarBlank />
              Calendário
            </Link>
            <Link
              href={`actions/report?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <Notepad />
              Relatórios
            </Link>
            {brand === "Control-iD" && (
              <div className="flex flex-wrap justify-center lg:justify-between items-center gap-4 px-10 w-full">
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <Link
                    href={`actions/control-id?lobby=${id}&brand=${brand}`}
                    className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                  >
                    <ScanSmiley />
                    Control iD
                  </Link>

                  {session?.payload.user.type === "ADMIN" && (
                    <Link
                      href={`actions/control-id/advanced?lobby=${id}&brand=${brand}`}
                      className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                    >
                      <Gear />
                      Avançado
                    </Link>
                  )}
                </div>
                <OpenDoorButton />
                <AccessLogsLive />
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="flex justify-center items-center my-8">
          <LoadingIcon />
        </div>
      )}
    </>
  );
}
