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
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Calendar {
  lobbyCalendarId: number;
  description: string;
  date: string;
  lobbyId: number;
}

export default function CalendarTable({ lobby }: { lobby: string }) {
  const [calendar, setCalendar] = useState<Calendar[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "lobbyCalendar/lobby/" + lobby;
      } else {
        path = `lobbyCalendar/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setCalendar(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("lobbyCalendar/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Essa data acabou de ser apagada.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteDate = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir data?",
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

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="uppercase">
        {calendar.map((holiday) => {
          const date = new Date(holiday.date);
          const formattedDate = format(date, "dd/MM/yyyy");
          return (
            <TableRow key={holiday.lobbyCalendarId}>
              <TableCell className="w-1/5">{formattedDate}</TableCell>
              <TableCell className="w-3/5">
                <p className="max-w-3/5 text-ellipsis overflow-hidden whitespace-nowrap">
                  {holiday.description}
                </p>
              </TableCell>
              <TableCell className="w-1/5 flex gap-4 text-2xl">
                <Link
                  href={`calendar/update?lobby=${holiday.lobbyId}&id=${holiday.lobbyCalendarId}`}
                >
                  <PencilLine />
                </Link>
                <button
                  onClick={() => deleteDate(holiday.lobbyCalendarId)}
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
            Total de registros: {calendar.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
