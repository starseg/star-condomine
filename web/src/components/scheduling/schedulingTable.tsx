"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { simpleDateFormat } from "@/lib/utils";
import {
  CaretLeft,
  CaretRight,
  FilePlus,
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";
import { Button } from "../ui/button";

export default function SchedulingTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduling, setScheduling] = useState<Scheduling[]>([]);
  const [page, setPage] = useState(1);
  const [paginatedScheduling, setPaginatedScheduling] = useState<Scheduling[]>(
    []
  );
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const router = useRouter();
  const itemsPerPage = 10;

  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "scheduling/lobby/" + lobby;
        } else {
          path = `scheduling/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setScheduling(response.data);
        setPaginatedScheduling(response.data.slice(0, itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const totalOfPages = Math.ceil(scheduling.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedScheduling(scheduling.slice(begin, end));
  }, [page, scheduling]);

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

  const deleteScheduling = async (id: number) => {
    deleteAction(session, "agendamento", `scheduling/${id}`, fetchData);
  };

  const operator = session?.payload.user.id || null;
  const registerAccess = async (
    visitor: number,
    member: number,
    reason: string,
    location: string
  ) => {
    const info = {
      visitorId: visitor,
      memberId: member,
      reason: reason,
      local: location,
      startTime: new Date().toISOString(),
      comments: "",
      operatorId: operator,
      lobbyId: Number(lobby),
    };
    try {
      await api.post("access", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      router.push(`/dashboard/actions/access?lobby=${lobby}&c=${control}`);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let currentDateUTC = currentDate.toISOString();

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-x-auto">
            <Table className="border border-stone-800 rouded-lg">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Visitado</TableHead>
                  <TableHead>Validade do acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="uppercase">
                {paginatedScheduling.map((item) => {
                  return (
                    <TableRow key={item.schedulingId}>
                      <TableCell>
                        {item.visitor.cpf === "" ||
                        item.visitor.rg === "" ||
                        item.visitor.name.split(" ").length < 2 ? (
                          <p className="max-w-[25ch] text-amber-400">
                            ⚠ {item.visitor.name}
                          </p>
                        ) : (
                          <p className="max-w-[25ch]">{item.visitor.name}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[25ch]">{item.member.name}</p>
                      </TableCell>
                      <TableCell>
                        {item.endDate >= currentDateUTC ? (
                          <p className="text-green-400">
                            {simpleDateFormat(item.startDate) +
                              " - " +
                              simpleDateFormat(item.endDate)}
                          </p>
                        ) : (
                          <p className="text-red-500">
                            {simpleDateFormat(item.startDate) +
                              " - " +
                              simpleDateFormat(item.endDate)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.status === "ACTIVE" ? (
                          <p className="text-green-400">ATIVO</p>
                        ) : (
                          <p className="text-red-400">INATIVO</p>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        {item.status === "INACTIVE" ||
                        item.endDate < currentDateUTC ? (
                          <button
                            disabled
                            title="Não disponível para registrar acesso"
                          >
                            <FilePlus className="text-muted" />
                          </button>
                        ) : (
                          <button
                            title="Registrar acesso"
                            onClick={() =>
                              registerAccess(
                                item.visitorId,
                                item.memberId,
                                item.reason,
                                item.location
                              )
                            }
                          >
                            <FilePlus />
                          </button>
                        )}
                        <Link
                          href={`scheduling/details?id=${item.schedulingId}`}
                        >
                          <MagnifyingGlass />
                        </Link>
                        <Link
                          href={`scheduling/update?lobby=${item.lobbyId}&id=${item.schedulingId}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          onClick={() => deleteScheduling(item.schedulingId)}
                          title="Excluir"
                        >
                          <Trash />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mr-4 mt-2">
            <div className="flex items-center gap-2  text-stone-400 font-medium">
              <div className="rounded-full w-6 h-6 bg-amber-500 text-stone-900 text-center">
                ⚠
              </div>
              : cadastro incompleto
            </div>
            <div className="flex items-center gap-4 pr-4">
              <p className="bg-stone-800 p-2 rounded">
                {scheduling.length} registros
              </p>
              <p>
                Página {page} de {totalOfPages}
              </p>
              <div className="flex items-center text-xl gap-4">
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
          </div>
        </>
      )}
    </>
  );
}
