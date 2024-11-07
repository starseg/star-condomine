"use client";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useState, useEffect } from "react";
import {
  destroyObjectCommand,
  listAccessRulesCommand, listGroupsCommand, listTimeSpansCommand,
  listTimeZonesCommand,
  listUsersCommand
} from "./commands";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem, SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingIcon from "@/components/loadingIcon";
import { secondsToHHMM } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Broom, FileSearch } from "@phosphor-icons/react/dist/ssr";


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

interface AccessRuleDevice extends AccessRule {
  id: number
}

interface TimeZoneDevice extends TimeZone {
  id: number
}

interface TimeSpanDevice extends TimeSpan {
  id: number,
  "time_zones.name": string
}

interface GroupDevice extends Group {
  id: number
}

export default function Push() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [id, setId] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRuleDevice[]>([]);
  const [timeZones, setTimeZones] = useState<TimeZoneDevice[]>([]);
  const [timeSpans, setTimeSpans] = useState<TimeSpanDevice[]>([]);
  const [groups, setGroups] = useState<GroupDevice[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const { data: session } = useSession();
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`);
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);

  async function sendCommand(command: object): Promise<void> {

    if (!id) {
      toast.warn("Selecione um dispositivo antes de enviar um comando.");
      return;
    }

    try {
      await api.post(`/control-id/add-command?id=${id}`, command);
      await fetchResults();

    } catch (error) {
      toast.error("Não foi possível enviar o comando.");
      console.error("Error sending command:", error);
    }
  }

  async function fetchResults(): Promise<void> {

    setUsers([]);
    setAccessRules([]);
    setTimeZones([]);
    setTimeSpans([]);
    setGroups([]);

    setIsFetching(true);
    await new Promise((resolve) => { setTimeout(resolve, 5000) });

    try {
      const response = await api.get("/control-id/results");

      if (response.data[response.data.length - 1].deviceId !== id) {
        toast.error("Não foi possível se conectar com o dispositivo, verifique a conexão.");
        setIsFetching(false);
        return
      }

      console.log(response.data);

      if (response.data.length > 0) {
        const data = JSON.parse(response.data[response.data.length - 1].body.response);

        if (data.users) {
          setUsers(data.users);
        }

        if (data.access_rules) {
          setAccessRules(data.access_rules);
        }

        if (data.time_zones) {
          setTimeZones(data.time_zones);
        }

        if (data.time_spans) {
          setTimeSpans(data.time_spans);
        }

        if (data.groups) {
          setGroups(data.groups);
        }

        toast.success("Comando executado com sucesso.");

      } else {
        toast.error("Erro ao executar o comando, verifique a conexão com o dispositivo.");
      }
    } catch (error) {
      toast.error("Não foi possível se conectar com o dispositivo, verifique a conexão.");
    }

    setIsFetching(false);
  }

  async function clearResults(): Promise<void> {
    try {
      await api.get("/control-id/clearResults");

      setUsers([]);
      setAccessRules([]);
      setTimeZones([]);
      setTimeSpans([]);
      setGroups([]);

      toast.success("Monitor de respostas limpo com sucesso.");
    } catch (error) {
      toast.error("Erro ao limpar monitor de respostas.");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-3/4 lg:w-[40%] 2xl:w-1/3">
      <Select value={id} onValueChange={setId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um dispositivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.name}>
                {device.ip} - {device.description} - {
                  device.status === "ACTIVE" ? (
                    <span className="text-green-500">Ativo</span>
                  ) : (
                    <span className="text-red-500">Inativo</span>
                  )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex gap-2 mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"} className="flex-1 flex gap-2 text-lg">
              <FileSearch /> Listar dados
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">Escolha uma opção: </DialogTitle>
              <DialogDescription className="flex flex-wrap justify-center gap-2">
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(listUsersCommand)}>
                    Listar usuários
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(listAccessRulesCommand)}>
                    Listar regras
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(listTimeZonesCommand)}>
                    Listar horários
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(listTimeSpansCommand)}>
                    Listar intervalos
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(listGroupsCommand)}>
                    Listar grupos
                  </Button>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"} className="flex-1 flex gap-2 text-lg">
              <Broom /> Limpar dados
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">Escolha uma opção: </DialogTitle>
              <DialogDescription className="flex flex-wrap justify-center gap-2">
                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={clearResults} title="Limpar">
                    Limpar monitor de respostas
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button disabled={isFetching} variant={"secondary"} onClick={() => sendCommand(destroyObjectCommand("access_logs"))} title="Limpar">
                    Limpar histórico de acessos
                  </Button>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>



      {users && users.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-lg">Usuários</p>
          <div className="space-y-2 border-primary/50 p-1 border rounded-md max-h-60 overflow-y-auto">
            {users.map((user) => {
              return (
                <div className="p-2 border rounded" key={user.id}>
                  <p>ID: {user.id}</p>
                  <p>Registro: {user.registration}</p>
                  <p>Nome: {user.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {accessRules && accessRules.length > 0 && (
        <>
          <p className="font-bold text-lg">Regras de Acesso</p>
          <div className="space-y-2 border-primary/50 p-1 border rounded-md max-h-60 overflow-y-auto">
            {accessRules.map((accessRule) => {
              return (
                <div className="p-2 border rounded" key={accessRule.accessRuleId}>
                  <p>ID: {accessRule.id}</p>
                  <p>Nome: {accessRule.name}</p>
                  <p>Prioridade: {accessRule.priority}</p>
                  <p>Tipo: {accessRule.type}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {timeZones && timeZones.length > 0 && (
        <>
          <p className="font-bold text-lg">Zonas de Tempo</p>
          <div className="space-y-2 border-primary/50 p-1 border rounded-md max-h-60 overflow-y-auto">
            {timeZones.map((timeZone) => {
              return (
                <div className="p-2 border rounded" key={timeZone.timeZoneId}>
                  <p>ID: {timeZone.id}</p>
                  <p>Nome: {timeZone.name}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {timeSpans && timeSpans.length > 0 && (
        <>
          <p className="font-bold text-lg">Intervalos de Tempo</p>
          <div className="space-y-2 border-primary/50 p-1 border rounded-md max-h-60 overflow-y-auto">
            {timeSpans.map((timeSpan) => {
              return (
                <div className="p-2 border rounded" key={timeSpan.timeSpanId}>
                  <p>ID: {timeSpan.id}</p>
                  <p>Horário: {timeSpan["time_zones.name"]}</p>
                  <p>Horário de Inicio: {secondsToHHMM(timeSpan.start)}</p>
                  <p>Horário de fim: {secondsToHHMM(timeSpan.end)}</p>
                  <p>Dias da Semana: {" "}
                    {timeSpan.sun == 1 && "Dom | "}
                    {timeSpan.mon == 1 && "Seg | "}
                    {timeSpan.tue == 1 && "Ter | "}
                    {timeSpan.wed == 1 && "Qua | "}
                    {timeSpan.thu == 1 && "Qui | "}
                    {timeSpan.fri == 1 && "Sex | "}
                    {timeSpan.sat == 1 && "Sab"}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {groups && groups.length > 0 && (
        <>
          <p className="font-bold text-lg">Grupos</p>
          <div className="space-y-2 border-primary/50 p-1 border rounded-md max-h-60 overflow-y-auto">
            {groups.map((group) => {
              return (
                <div className="p-2 border rounded" key={group.groupId}>
                  <p>ID: {group.id}</p>
                  <p>Nome: {group.name}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isFetching && (
        <div className="flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
