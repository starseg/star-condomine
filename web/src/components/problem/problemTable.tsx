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
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function ProblemTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const fetchData = async () => {
    if (session)
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
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteProblem = async (id: number) => {
    deleteAction(session, "problema", `lobbyProblem/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
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
      )}
    </>
  );
}
