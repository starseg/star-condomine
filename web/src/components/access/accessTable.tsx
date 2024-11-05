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
import { formatDate } from "@/lib/utils";
import {
  CaretLeft,
  CaretRight,
  FilePlus,
  FileSearch,
  MagnifyingGlass,
  PencilLine,
  SignOut,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";
import { Button, buttonVariants } from "../ui/button";

export default function AccessTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<Access[]>([]);
  const [page, setPage] = useState(1);
  const [paginatedAccess, setPaginatedAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const control = params.get("c");
  const itemsPerPage = 10;

  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "access/lobby/" + lobby;
        } else {
          path = `access/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setAccess(response.data);
        setPaginatedAccess(response.data.slice(0, itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const totalOfPages = Math.ceil(access.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedAccess(access.slice(begin, end));
  }, [page, access]);

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

  const deleteAccess = async (id: number) => {
    deleteAction(session, "acesso", `access/${id}`, fetchData);
  };

  const registerExit = async (id: number) => {
    try {
      await api.put(
        "access/" + id,
        {
          endTime: new Date().toJSON(),
          status: "INACTIVE",
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        }
      );
      fetchData();
      Swal.fire({
        title: "Saída registrada!",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro registrar saída:", error);
    }
  };

  const duplicateEntries: Record<number, Access[]> = {};

  // Identificar registros duplicados sem data de saída
  access.forEach((item: Access) => {
    if (!item.endTime) {
      if (!duplicateEntries[item.visitorId]) {
        duplicateEntries[item.visitorId] = [];
      }
      duplicateEntries[item.visitorId].push(item);
    }
  });

  // Objeto para armazenar os registros mais antigos entre os duplicados
  const oldestEntries: Record<number, Access> = {};
  Object.values(duplicateEntries).forEach((entries) => {
    entries.forEach((entry) => {
      if (
        !oldestEntries[entry.visitorId] ||
        new Date(entry.startTime) <
        new Date(oldestEntries[entry.visitorId].startTime)
      ) {
        oldestEntries[entry.visitorId] = entry;
      }
    });
  });

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-x-auto">
            <Table className="border-stone-800 border rouded-lg">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Visitado</TableHead>
                  <TableHead>Data de entrada</TableHead>
                  {control === "S" ? <TableHead>Data de saída</TableHead> : ""}
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="uppercase">
                {paginatedAccess.map((item) => {
                  const isOldestEntry: boolean =
                    oldestEntries[item.visitorId] &&
                    control === "S" &&
                    oldestEntries[item.visitorId].accessId === item.accessId;
                  const nameStyle: React.CSSProperties = isOldestEntry
                    ? { color: "#f87171", fontWeight: "bold" }
                    : {};
                  return (
                    <TableRow key={item.accessId} style={nameStyle}>
                      <TableCell>
                        <p className="max-w-[25ch]">
                          {item.visitor.name !== null
                            ? item.visitor.name
                            : "desconhecido"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[25ch]">{item.member.name}</p>
                      </TableCell>
                      <TableCell>{formatDate(item.startTime)}</TableCell>
                      {control === "S" ? (
                        <TableCell>
                          {item.endTime !== null && item.endTime.length > 0
                            ? formatDate(item.endTime)
                            : "Não saiu"}
                        </TableCell>
                      ) : (
                        ""
                      )}
                      <TableCell className="flex gap-4 text-2xl">
                        {control === "S" ? (
                          item.endTime !== null && item.endTime.length > 1 ? (
                            <button
                              title="Saída registrada"
                              disabled
                              className="text-muted"
                            >
                              <SignOut />
                            </button>
                          ) : (
                            <button
                              onClick={() => registerExit(item.accessId)}
                              title="Registrar saída"
                            >
                              <SignOut />
                            </button>
                          )
                        ) : (
                          ""
                        )}
                        <Link
                          href={`access/details?id=${item.accessId}&c=${control}`}
                        >
                          <MagnifyingGlass />
                        </Link>
                        <Link
                          href={`access/update?lobby=${item.lobbyId}&id=${item.accessId}&c=${control}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          onClick={() => deleteAccess(item.accessId)}
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={`access/new?lobby=${lobby}&c=${control}`}
                className={buttonVariants({ variant: "default" })}
              >
                <p className="flex items-center gap-2 text-xl">
                  <FilePlus size={24} /> Registrar Acesso
                </p>
              </Link>
              <Link
                href={`scheduling?lobby=${lobby}&c=${control}`}
                className={buttonVariants({ variant: "default" })}
              >
                <p className="flex items-center gap-2 text-xl">
                  <FileSearch size={24} /> Agendamentos
                </p>
              </Link>
              <Link
                href={`visitor?lobby=${lobby}&c=${control}`}
                className={buttonVariants({ variant: "default" })}
              >
                <p className="flex items-center gap-2 text-xl">
                  <FileSearch size={24} /> Visitantes
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-4 pr-4">
              <p className="bg-stone-800 p-2 rounded">
                {access.length} registros
              </p>
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
          </div>
        </>
      )}
    </>
  );
}
