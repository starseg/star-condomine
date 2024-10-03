import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableHeader, TableRow, TableHead, TableBody, Table, TableCell } from "@/components/ui/table";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { listLogsCommand } from "../device/commands";
import { eventLogs } from "./event-logs";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import Image from "next/image";

export function AccessLogs() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [serialId, setSerialId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [paginatedAcessLogs, setPaginatedAcessLogs] = useState<AccessLog[]>([]);

  async function searchAccessLogs() {
    setIsLoading(true);
    await api.post(`/control-id/add-command?id=${serialId}`, listLogsCommand);
    await new Promise((resolve) => {
      setTimeout(async () => {
        fetchResults()
        resolve(true);
      }, 5000);
    });
    setIsLoading(false);
  }


  async function fetchResults() {
    const response = await api.get("/control-id/results");
    const lastResult = response.data[response.data.length - 1].body.response;

    console.log(response.data[response.data.length - 1].deviceId);

    if (response.data[response.data.length - 1].deviceId !== serialId) {
      toast.error("Ocorreu um erro ao obter os registros de acesso.");
      setAccessLogs([]);
      return
    };

    try {
      const accessLogs = JSON.parse(lastResult);
      setAccessLogs(accessLogs.access_logs.reverse()); // Inverte a ordem dos registros
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      toast.error("Ocorreu um erro ao obter os registros de acesso.");
    }
  };

  useEffect(() => {
    if (serialId) {
      searchAccessLogs();
    }
  }, [serialId]);

  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  async function fetchMembers() {
    if (session)
      try {
        const response = await api.get(`member/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });

        setMembers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }

  async function fetchVisitors() {
    if (session)
      try {
        const response = await api.get(`visitor/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });

        setVisitors(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }

  useEffect(() => {
    fetchDevices();
    fetchMembers();
    fetchVisitors();
  }, [session]);


  const itemsPerPageOptions = [5, 10, 25, 50, 100];
  const totalOfPages = Math.ceil(accessLogs.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedAcessLogs(accessLogs.slice(begin, end));
  }, [page, accessLogs, itemsPerPage]);

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
      return members.find((member) => member.memberId === id)?.name ?? "Usuário não encontrado";
    } else if (id > 10_000) {
      return visitors.find((visitor) => visitor.visitorId === id - 10_000)?.name ?? "Usuário não encontrado";
    } else {
      return "Usuário não encontrado";
    }
  }


  return (
    <div className="flex flex-col gap-6 justify-between mt-2 w-full">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl">Registros de Acesso</h2>
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
                        <TableCell>
                          {getUserNameById(log.user_id)}
                        </TableCell>
                        <TableCell>{new Date(log.time * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(log.time * 1000).toLocaleTimeString()}</TableCell>
                        <TableCell style={{ color: `${eventLogs[log.event].color}` }} className="font-bold">
                          {eventLogs[log.event].value}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col gap-2 mt-10">
              <Image src="/undraw_location_search.svg" alt="Sem registros" width={982 / 2} height={763 / 2} />
              <p className="font-bold">Não há nenhum dado a ser exibido.</p>
            </div>
          )}
        </>
      )}
      {(serialId && !isLoading && accessLogs.length > 0) && (
        <div className="flex items-center gap-4 mt-4 pr-4 justify-end">
          <p className="bg-stone-800 p-2 rounded">
            {accessLogs.length} registros
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