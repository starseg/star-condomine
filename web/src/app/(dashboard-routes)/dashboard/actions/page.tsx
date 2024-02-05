"use client";
import { Menu } from "@/components/menu";
import ActionButton from "@/components/actionButton";
import ActionSet from "@/components/lobby/actionSet";
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

interface LobbyProps {
  lobbyId: number;
  cnpj: string;
  name: string;
  responsible: string;
  telephone: string;
  cep: string;
  city: string;
  complement: string;
  neighborhood: string;
  number: string;
  procedures: string;
  scheduling: string;
  state: string;
  street: string;
  type: string;
  exitControl: "ACTIVE" | "INACTIVE";
}

interface CalendarProps {
  lobbyCalendarId: number;
  date: string;
  description: string;
}

export default function LobbyDetails() {
  const [lobby, setLobby] = useState<LobbyProps | null>(null);
  const [calendar, setCalendar] = useState<CalendarProps[] | null>(null);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fetchData = async () => {
    const params = new URLSearchParams(searchParams);
    try {
      const path = "lobby/find/" + params.get("id");
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      if (response.data) {
        // console.log(response.data);
        setLobby(response.data);
      }
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  const fetchCalendar = async () => {
    const params = new URLSearchParams(searchParams);
    try {
      const path = "lobbyCalendar/today/" + params.get("id");
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      if (response.data) {
        // console.log(response.data);
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
  }, []);
  if (lobby) {
    id = lobby.lobbyId;
    control = lobby.exitControl === "ACTIVE" ? "S" : "N";
  }
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="max-w-5xl mx-auto mb-24">
        <div>
          <h1 className="text-4xl mt-2 text-primary mb-2">
            Portaria: {lobby ? lobby.name : "Desconhecida"}
          </h1>
          {calendar && calendar.length > 0 && (
            <p className="text-xl flex items-center gap-2">
              <Warning size={32} className="text-red-500" /> Verifique as
              restrições do feriado de hoje
            </p>
          )}
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center lg:flex-row">
          <div className="flex w-full flex-col items-center justify-center lg:items-start lg:justify-start lg:w-1/2 lg:border-r lg:border-stone-50">
            <div>
              <h2 className="flex text-3xl mb-4">
                <PersonSimpleRun className="mr-2" />
                Acessos
              </h2>
              <ActionSet
                register={`actions/access/new?lobby=${id}`}
                list={`actions/access?lobby=${id}&c=${control}`}
              />
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <CalendarCheck className="mr-2" />
                Agendamentos
              </h2>
              <ActionSet
                register={`actions/scheduling/new?lobby=${id}`}
                list={`actions/scheduling?lobby=${id}&c=${control}`}
              />
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <IdentificationCard className="mr-2" />
                Visitantes
              </h2>
              <ActionSet
                register={`actions/visitor/new?lobby=${id}`}
                list={`actions/visitor?lobby=${id}`}
              />
            </div>
            {lobby ? (
              lobby.type === "COMPANY" ? (
                <div>
                  <h2 className="flex text-3xl mt-12 mb-4">
                    <HouseLine className="mr-2" />
                    Funcionários
                  </h2>
                  <ActionSet
                    register={`actions/employee/new?lobby=${id}`}
                    list={`actions/employee?lobby=${id}`}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="flex text-3xl mt-12 mb-4">
                    <HouseLine className="mr-2" />
                    Moradores
                  </h2>
                  <ActionSet
                    register={`actions/resident/new?lobby=${id}`}
                    list={`actions/resident?lobby=${id}`}
                  />
                </div>
              )
            ) : (
              ""
            )}
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <Car className="mr-2" />
                Veículos
              </h2>
              <ActionSet
                register={`actions/vehicle/new?lobby=${id}`}
                list={`actions/vehicle?lobby=${id}`}
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center lg:items-start lg:justify-start lg:w-1/2 lg:ml-8">
            <div>
              <h2 className="flex text-3xl mb-4 mt-12 lg:mt-0">
                <DeviceMobileCamera className="mr-2" />
                Dispositivos
              </h2>
              <ActionSet
                register={`actions/device/new?lobby=${id}`}
                list={`actions/device?lobby=${id}`}
              />
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <SealWarning className="mr-2" />
                Problemas
              </h2>
              <ActionSet
                register={`actions/problem/new?lobby=${id}`}
                list={`actions/problem?lobby=${id}`}
              />
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <CalendarBlank className="mr-2" />
                Calendário de Feriados
              </h2>
              <ActionSet
                register={`actions/calendar/new?lobby=${id}`}
                list={`actions/calendar?lobby=${id}`}
              />
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <Notepad className="mr-2" />
                Relatórios
              </h2>
              <div className="flex gap-4">
                <ActionButton
                  url={`actions/report?lobby=${id}&c=${control}`}
                  type="-"
                  text="Visualizar"
                />
              </div>
            </div>
            <div>
              <h2 className="flex text-3xl mt-12 mb-4">
                <MagnifyingGlass className="mr-2" />
                Detalhes
              </h2>
              <ActionButton
                url={`actions/details?lobby=${id}`}
                type="-"
                text="Visualizar"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
