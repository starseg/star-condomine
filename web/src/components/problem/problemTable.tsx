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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "lobbyProblem/lobby/" + lobby;
      } else {
        path = `lobbyProblem/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
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
  }, [session, searchParams]);

  // // console.log(devices);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("lobbyProblem/" + id, {
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
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
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
    }
  };

  return (
    <Table className="border border-stone-800 rouded-lg">
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
      <TableBody className="uppercase">
        {problems.map((problem) => (
          <TableRow key={problem.lobbyProblemId}>
            <TableCell>{problem.title}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                      {problem.description}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                    <p>{problem.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{formatDate(problem.date)}</TableCell>
            <TableCell>
              {problem.status === "ACTIVE" ? (
                <p className="text-red-400">Ativo</p>
              ) : (
                <p className="text-green-400">Resolvido</p>
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
