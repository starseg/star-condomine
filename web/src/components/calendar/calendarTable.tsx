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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  const fetchData = async () => {
    try {
      const response = await api.get("lobbyCalendar/lobby/" + lobby, {
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
  }, [session]);

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
  };

  return (
    <Table className="border border-stone-800 rouded-lg max-w-[90%] mx-auto">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
