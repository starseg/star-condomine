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
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";
import { deleteFile } from "@/lib/firebase-upload";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VisitorTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [page, setPage] = useState(1);
  const [paginatedVisitors, setPaginatedVisitors] = useState<Visitor[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");

  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "visitor/lobby/" + lobby;
        } else {
          path = `visitor/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setVisitors(response.data);
        setPaginatedVisitors(response.data.slice(0, itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const itemsPerPageOptions = [5, 10, 25, 50, 100];
  const totalOfPages = Math.ceil(visitors.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedVisitors(visitors.slice(begin, end));
  }, [page, visitors, itemsPerPage]);

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

  const deleteVisitor = async (id: number, url: string) => {
    deleteAction(session, "visitante", `visitor/${id}`, fetchData);
    deleteFile(url);
  };

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
                  <TableHead>Documentos</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="uppercase">
                {paginatedVisitors.map((visitor) => {
                  const openAccess =
                    visitor.access.length > 0 &&
                    visitor.lobby.exitControl === "ACTIVE";
                  return (
                    <TableRow key={visitor.visitorId}>
                      <TableCell className="flex flex-col">
                        {visitor.cpf.length > 0 && <p>{visitor.cpf}</p>}
                        {visitor.rg.length > 0 && <p>{visitor.rg}</p>}
                      </TableCell>
                      <TableCell>
                        {visitor.cpf === "" ||
                        visitor.rg === "" ||
                        visitor.name.split(" ").length < 2 ? (
                          <p className="text-amber-400 text-lg">⚠</p>
                        ) : (
                          ""
                        )}
                        {openAccess ? (
                          <p className="text-red-400 font-semibold">
                            {visitor.name}
                          </p>
                        ) : (
                          visitor.name
                        )}
                      </TableCell>
                      <TableCell>{visitor.visitorType.description}</TableCell>
                      <TableCell>
                        {visitor.scheduling.length > 0 ? (
                          <Link
                            href={`scheduling?lobby=${lobby}&c=${control}&query=${visitor.name}`}
                            className="text-green-300 flex gap-1 items-center"
                          >
                            Sim - <MagnifyingGlass size={18} />
                          </Link>
                        ) : (
                          <p className="text-red-200">Não</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {visitor.status === "ACTIVE" ? (
                          <p className="text-green-500">ATIVO</p>
                        ) : (
                          <p className="text-red-400">BLOQUEADO</p>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        <Link
                          href={`visitor/details?id=${visitor.visitorId}&c=${control}`}
                        >
                          <MagnifyingGlass />
                        </Link>
                        <Link
                          href={`visitor/update?id=${visitor.visitorId}&lobby=${lobby}&c=${control}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          onClick={() =>
                            deleteVisitor(visitor.visitorId, visitor.profileUrl)
                          }
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
          <div className="flex justify-between mr-4">
            {control === "S" && (
              <div className="mt-4 flex items-center gap-2  text-stone-400 font-medium">
                <div className="rounded-full w-6 h-6 bg-red-400"></div>:
                visitantes com acesso sem saída finalizada
              </div>
            )}
            <div className="mt-4 flex items-center gap-2  text-stone-400 font-medium">
              <div className="rounded-full w-6 h-6 bg-amber-500 text-stone-900 text-center">
                ⚠
              </div>
              : cadastro incompleto
            </div>
            <div className="flex items-center gap-4 mt-4 pr-4">
              <p className="bg-stone-800 p-2 rounded">
                {visitors.length} registros
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
                        className="flex items-center justify-center"
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
