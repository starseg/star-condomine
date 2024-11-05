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
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyncVisitor } from "../control-id/device/syncVisitor";
import { cn } from "@/lib/utils";
import { destroyObjectCommand } from "../control-id/device/commands";
import { toast } from "react-toastify";
import { DeleteDialog } from "../deleteDialog";

export default function VisitorTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [page, setPage] = useState(1);
  const [paginatedVisitors, setPaginatedVisitors] = useState<Visitor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const control = params.get("c");
  const brand = params.get("brand");

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
  async function fetchDevices() {
    if (session)
      try {
        const devices = await api.get(`/device/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(devices.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }
  useEffect(() => {
    fetchDevices();
  }, [session]);
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
    // deleteAction(session, "visitante", `visitor/${id}`, fetchData);
    try {
      await api.delete(`visitor/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      if (brand === "Control-iD")
        devices.map(async (device) => {
          await api.post(
            `/control-id/add-command?id=${device.name}`,
            destroyObjectCommand("users", { users: { id: id + 10000 } })
          );
        });
      deleteFile(url);
      toast.success("Visitante excluído com sucesso!");
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

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
                      <TableCell>
                        {visitor.cpf.length > 0 && <p>{visitor.cpf}</p>}
                        {visitor.rg.length > 0 && <p>{visitor.rg}</p>}
                      </TableCell>
                      <TableCell>
                        {visitor.cpf === "" ||
                          visitor.rg === "" ||
                          (visitor.name.split(" ").length < 2 && (
                            <p className="text-amber-400 text-lg">⚠</p>
                          ))}
                        {openAccess ? (
                          <p className="font-semibold text-red-400">
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
                            className="flex items-center gap-1 text-green-300"
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
                      <TableCell className="flex gap-2 text-2xl">
                        <Link
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "p-1 text-2xl aspect-square"
                          )}
                          href={`visitor/details?id=${visitor.visitorId}&lobby=${lobby}&c=${control}&brand=${brand}`}
                        >
                          <MagnifyingGlass />
                        </Link>
                        <Link
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "p-1 text-2xl aspect-square"
                          )}
                          href={`visitor/update?id=${visitor.visitorId}&lobby=${lobby}&c=${control}`}
                        >
                          <PencilLine />
                        </Link>
                        <DeleteDialog
                          module={`visitante ${visitor.name}`}
                          confirmFunction={() =>
                            deleteVisitor(visitor.visitorId, visitor.profileUrl)
                          }
                        />
                        {/* <Button
                          variant={"ghost"}
                          className="p-1 text-2xl aspect-square"
                          onClick={() =>
                            deleteVisitor(visitor.visitorId, visitor.profileUrl)
                          }
                          title="Excluir"
                        >
                          <Trash />
                        </Button> */}
                        {brand === "Control-iD" && (
                          <SyncVisitor visitor={visitor} devices={devices} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mr-4">
            {control === "S" && (
              <div className="flex items-center gap-2 mt-4 font-medium text-stone-400">
                <div className="bg-red-400 rounded-full w-6 h-6"></div>:
                visitantes com acesso sem saída finalizada
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 font-medium text-stone-400">
              <div className="bg-amber-500 rounded-full w-6 h-6 text-center text-stone-900">
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
          </div>
        </>
      )}
    </>
  );
}
