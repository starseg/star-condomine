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

interface Problem {
  lobbyProblemId: number;
  title: string;
  description: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  operatorId: number;
  operator: {
    operatorId: number;
    name: string;
  };
}

export default function ProblemTable({ lobby }: { lobby: string }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("lobbyProblem/lobby/" + lobby, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setProblems(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  // console.log(devices);

  const deleteAction = async (id: number) => {
    console.log("problem/" + id);
    try {
      await api.delete("problem/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse problema acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteProblem = async (id: number) => {
    Swal.fire({
      title: "Excluir problema?",
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
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Data e hora</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Operador</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem) => (
          <TableRow key={problem.lobbyProblemId}>
            <TableCell>{problem.title}</TableCell>
            <TableCell className="max-w-[20ch] break-words">
              {problem.description}
            </TableCell>
            <TableCell>{formatDate(problem.date)}</TableCell>
            <TableCell>
              {problem.status === "ACTIVE" ? (
                <p className="text-green-400">Ativo</p>
              ) : (
                <p className="text-red-400">Inativo</p>
              )}
            </TableCell>
            <TableCell>{problem.operator.name}</TableCell>
            <TableCell className="flex gap-4 text-2xl">
              <Link
                href={`problem/update?lobby=${problem.lobbyId}&id=${problem.lobbyProblemId}`}
              >
                <PencilLine />
              </Link>
              <button
                onClick={() => deleteProblem(problem.lobbyProblemId)}
                title="Excluir"
              >
                <Trash />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={6}>
            Total de registros: {problems.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
