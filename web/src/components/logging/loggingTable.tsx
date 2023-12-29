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
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Log {
  logId: number;
  date: string;
  method: string;
  url: string;
  userAgent: string;
  operatorId: string;
  operator: {
    name: string;
  };
}

export default function LoggingTable() {
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
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("log/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse registro acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteLog = async (id: number) => {
    Swal.fire({
      title: "Excluir registro?",
      text: "Essa ação não poderá ser desfeita.",
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
    <Table className="border border-stone-800 rouded-lg max-w-[90%] mx-auto">
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
  );
}
