"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import {
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

interface Scheduling {
  schedulingId: number;
  startDate: string;
  endDate: string;
  location: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  operatorId: number;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
}

export default function SchedulingTable({ lobby }: { lobby: string }) {
  const [scheduling, setScheduling] = useState<Scheduling[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "scheduling/lobby/" + lobby;
        // console.log(path);
      } else {
        path = `scheduling/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setScheduling(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("scheduling/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse agendamento acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteScheduling = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir agendamento?",
        text: "Essa ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43C04F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAction(id);
        }
      });
    }
  };

  let currentDate = new Date().toJSON();

  return (
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
      <TableBody>
        {scheduling.map((item) => {
          return (
            <TableRow key={item.schedulingId}>
              <TableCell>
                <p className="max-w-[20ch] text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-auto hover:max-w-full">
                  {item.visitor.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="max-w-[20ch] text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-auto hover:max-w-full">
                  {item.member.name}
                </p>
              </TableCell>
              <TableCell>
                {item.endDate > currentDate ? (
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
                <Link href={`scheduling/details?id=${item.schedulingId}`}>
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
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={5}>
            Total de registros: {scheduling.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
