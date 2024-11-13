"use client";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
  TableCell,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { listLogsCommand } from "../device/commands";
import { eventLogs } from "./event-logs";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import Image from "next/image";
import { addHours, format } from "date-fns";
import { Input } from "@/components/ui/input";

export function AccessLogs() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [serialId, setSerialId] = useState("");
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [paginatedAcessLogs, setPaginatedAcessLogs] = useState<AccessLog[]>([]);

  const itemsPerPageOptions = [5, 10, 25, 50, 100];
  const filteredLogs = applyFilter(accessLogs);
  const totalOfPages = Math.ceil(filteredLogs.length / itemsPerPage);

  function applyFilter(logs: AccessLog[]) {
    if (filter) {
      return logs.filter((log) => {
        const userName = getUserNameById(log.user_id);
        return userName.toLowerCase().includes(filter.toLowerCase());
      });
    }

    return logs;
  }

  async function searchAccessLogs() {
    setIsLoading(true);
    await api.post(`/control-id/add-command?id=${serialId}`, listLogsCommand);
    await new Promise((resolve) => {
      setTimeout(async () => {
        fetchResults();
        resolve(true);
      }, 5000);
    });
    setIsLoading(false);
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

    if (response.data[response.data.length - 1].deviceId !== serialId) {
      toast.error(
        "Ocorreu um erro ao obter os registros de acesso, verifique se o dispositivo está conectado e tente novamente."
      );
      setAccessLogs([]);
      return;
    }

    try {
      const accessLogs = JSON.parse(lastResult);
      setAccessLogs(accessLogs.access_logs.reverse()); // Inverte a ordem dos registros
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      toast.error("Ocorreu um erro ao obter os registros de acesso.");
    }
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
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    }
  };

  const changePage = (operation: string) => {
    setPage((prevPage) => {
      if (operation === "+" && prevPage < totalOfPages) {
        return prevPage + 1;
      } else if (operation === "-" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const changeItemsPerPage = (amount: number) => {
    setItemsPerPage(amount);
    setPage(1);
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
    if (serialId) {
      searchAccessLogs();
    }
  }, [serialId]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedAcessLogs(filteredLogs.slice(begin, end));
  }, [page, accessLogs, itemsPerPage, filter]);

  return (
    <div className="flex flex-col justify-between gap-6 mt-2 w-full">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-3xl">Registros das leitoras</h2>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Filtrar por nome"
            className="flex-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Select value={serialId} onValueChange={setSerialId}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Selecione um dispositivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {devices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.name}>
                    {device.ip} - {device.description} - {device.lobby.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          {accessLogs.length > 0 ? (
            <div className="w-full max-h-[60vh] overflow-auto">
              <Table className="border w-full">
                <TableHeader>
                  <TableRow className="bg-secondary hover:bg-secondary">
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data do registro</TableHead>
                    <TableHead>Horário do registro</TableHead>
                    <TableHead>Tipo do evento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAcessLogs.map((log) => {
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="flex items-center gap-2">
                          <img
                            src={getUserPhotoById(log.user_id)}
                            alt=""
                            className="rounded-full max-w-16 aspect-square object-cover"
                          />
                          {getUserNameById(log.user_id)}
                        </TableCell>
                        <TableCell>
                          {format(
                            addHours(new Date(log.time * 1000), 3),
                            "dd/MM/yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            addHours(new Date(log.time * 1000), 3),
                            "HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell
                          style={{ color: `${eventLogs[log.event].color}` }}
                          className="font-bold"
                        >
                          {eventLogs[log.event].value}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 mt-10">
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
      {serialId && !isLoading && accessLogs.length > 0 && (
        <div className="flex justify-end items-center gap-4 mt-4 pr-4">
          <p className="bg-stone-800 p-2 rounded">
            {filteredLogs.length} registros
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <CaretDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Itens por página</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {itemsPerPageOptions.map((item) => {
                return (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      changeItemsPerPage(item);
                    }}
                    className="flex justify-center items-center"
                  >
                    {item} itens
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <p>
            Página {page} de {totalOfPages}
          </p>
          <div className="flex items-center gap-4 text-xl">
            <Button
              variant={"outline"}
              className="p-0 aspect-square"
              title="Anterior"
              disabled={page === 1}
              onClick={() => changePage("-")}
            >
              <CaretLeft />
            </Button>
            <Button
              variant={"outline"}
              className="p-0 aspect-square"
              title="Próxima"
              disabled={page === totalOfPages}
              onClick={() => changePage("+")}
            >
              <CaretRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
