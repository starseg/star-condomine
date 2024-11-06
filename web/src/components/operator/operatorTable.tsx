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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function OperatorTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  const { data: session } = useSession();
  const fetchData = async () => {
    if (session) {
      try {
        const [responseLobbies, responseOperators] = await Promise.all([
          api.get("lobby"),
          api.get("operator"),
        ]);
        setLobbies(responseLobbies.data);
        setOperators(responseOperators.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteOperator = async (id: number) => {
    deleteAction(session, "operador", `operator/${id}`, fetchData);
  };

  async function getlobbyName(lobbyId: number | null) {
    if (!lobbyId) return "Todas";
    const response = lobbies.find((lobby) => lobby.lobbyId === lobbyId);
    if (response) return response.name;
  }

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="max-h-[60vh] overflow-x-auto">
          <Table className="border-stone-800 border">
            <TableHeader className="bg-stone-800 font-semibold">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Tipo de Usuário</TableHead>
                <TableHead>Portaria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.operatorId}>
                  <TableCell>{operator.name}</TableCell>
                  <TableCell>{operator.username}</TableCell>
                  <TableCell>********</TableCell>
                  <TableCell>
                    {operator.type === "ADMIN" ? "Administrador" : "Comum"}
                  </TableCell>
                  <TableCell>
                    {operator.lobbyId ? "Externo" : "Interno"}
                  </TableCell>
                  <TableCell>{getlobbyName(operator.lobbyId)}</TableCell>
                  <TableCell>
                    {operator.status === "ACTIVE" ? (
                      <p className="text-green-500">Ativo</p>
                    ) : (
                      <p className="text-red-400">Inativo</p>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-4 text-2xl">
                    <Link href={`operators/update?id=${operator.operatorId}`}>
                      <PencilLine />
                    </Link>
                    <button
                      onClick={() => deleteOperator(operator.operatorId)}
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
                <TableCell className="text-right" colSpan={8}>
                  Total de registros: {operators.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </>
  );
}
