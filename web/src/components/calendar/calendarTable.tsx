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
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

interface Calendar {
  lobbyCalendarId: number;
  description: string;
  date: string;
  lobbyId: number;
}

export default function CalendarTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteDate = async (id: number) => {
    deleteAction(session, "data", `lobbyCalendar/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
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
      )}
    </>
  );
}
