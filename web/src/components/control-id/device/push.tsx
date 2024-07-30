"use client";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  createUserCommand,
  listAccessRulesCommand,
  listUsersCommand,
} from "./commands";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Broom } from "@phosphor-icons/react/dist/ssr";

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

export default function Push() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [id, setId] = useState("");
  const [commandsCount, setCommandsCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  // const [isActive, setActive] = useState(false);
  // const [ip, setIP] = useState("");
  // const [session, setSession] = useState("");
  // useEffect(() => {
  //   const ip = localStorage.getItem("device_ip");
  //   if (ip) setIP(ip);
  //   const id = localStorage.getItem("device_id");
  //   if (id) setId(id);
  //   const session = localStorage.getItem("session");
  //   if (session) setSession(session);
  // }, [commandPulse]);

  // async function setPush() {
  //   try {
  //     let response;
  //     if (!isActive) {
  //       response = await axios.post(
  //         `http://${ip}/set_configuration.fcgi?session=${session}`,
  //         {
  //           push_server: {
  //             push_request_timeout: "5000",
  //             push_request_period: "15",
  //             push_remote_address: "http://192.168.1.53:3333/control-id",
  //           },
  //         }
  //       );
  //       if (response.status === 200) {
  //         console.log("Ativado ☀");
  //         setActive(true);
  //       }
  //     } else {
  //       response = await axios.post(
  //         `http://${ip}/set_configuration.fcgi?session=${session}`,
  //         {
  //           push_server: {
  //             push_remote_address: "",
  //           },
  //         }
  //       );
  //       if (response.status === 200) {
  //         console.log("Desativado 🌙");
  //         setActive(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Erro ao efetuar push: ", error);
  //   }
  // }

  const { data: session } = useSession();
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get("device", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);

  async function sendCommand(command: object): Promise<void> {
    try {
      const response = await api.post(
        `/control-id/add-command?id=${id}`,
        command
      );
      console.log(response.data.message);
      setCommandsCount(commandsCount + 1);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  }

  async function fetchResults(): Promise<void> {
    try {
      const response = await api.get("/control-id/results");
      console.log(response.data);
      if (response.data.length > 0) {
        const users = JSON.parse(
          response.data[response.data.length - 1].response
        );
        setUsers(users.users);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }
  useEffect(() => {
    fetchResults();
  }, [commandsCount]);

  async function clearResults(): Promise<void> {
    try {
      await api.get("/control-id/clearResults");
      setUsers([]);
      setCommandsCount(0);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  return (
    <div className="w-3/4 lg:w-[40%] 2xl:w-1/3 flex flex-col gap-4">
      <Select value={id} onValueChange={setId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um dispositivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.name}>
                {device.ip} - {device.name} - {device.lobby.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex flex-wrap justify-between gap-4">
        {/* <Button onClick={setPush} className="w-[30%]">
          {!isActive ? "Ativar push" : "Desativar push"}
        </Button> */}
        <Button onClick={clearResults} title="Limpar">
          <Broom size={24} />
        </Button>
        <Button onClick={() => sendCommand(listUsersCommand)}>
          Listar usuários
        </Button>
        <Button onClick={() => sendCommand(listAccessRulesCommand)}>
          Listar regras
        </Button>
        <Button
          onClick={() =>
            sendCommand(
              createUserCommand(Math.floor(Math.random() * 1000), "Edson")
            )
          }
        >
          Criar usuário
        </Button>
      </div>
      {users && users.length > 0 && (
        <>
          <p className="text-lg font-bold">Usuários</p>
          <div className="max-h-60 overflow-y-auto space-y-1 p-1 border border-primary/50 rounded-md">
            {users.map((user) => {
              return (
                <div className="border rounded p-2" key={user.id}>
                  <p>ID: {user.id}</p>
                  <p>Registro: {user.registration}</p>
                  <p>Nome: {user.name}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="h-8 p-1 rounded-full bg-primary text-stone-900 font-bold flex items-center justify-center">
        Comandos enviados: {commandsCount}
      </div>
    </div>
  );
}
