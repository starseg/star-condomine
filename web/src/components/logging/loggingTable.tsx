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
import { formatDate } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function LoggingTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("log", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setLogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteLog = async (id: number) => {
    deleteAction(session, "registro", `log/${id}`, fetchData);
  };

  const formatMethod = (method: string) => {
    switch (method) {
      case "POST":
        return "Registro";
      case "PUT":
        return "Edição";
      case "DELETE":
        return "Exclusão";
      default:
        return "Desconhecido";
    }
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
              <TableHead>Usuário</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Url</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.logId}>
                <TableCell>{formatDate(log.date)}</TableCell>
                <TableCell>{log.operator.name}</TableCell>
                <TableCell>{formatMethod(log.method)}</TableCell>
                <TableCell>{log.url}</TableCell>
                <TableCell className="flex gap-4 text-2xl">
                  <button onClick={() => deleteLog(log.logId)} title="Excluir">
                    <Trash />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right" colSpan={6}>
                Total de registros: {logs.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
