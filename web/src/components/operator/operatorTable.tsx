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
import Swal from "sweetalert2";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

interface Operator {
  operatorId: number;
  username: string;
  name: string;
  password: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function OperatorTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("operator", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setOperators(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteOperator = async (id: number) => {
    deleteAction(session, "operador", `operator/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="max-h-[60vh] overflow-x-auto rouded-lg max-w-[90%] mx-auto">
          <Table className="border border-stone-800">
            <TableHeader className="bg-stone-800 font-semibold">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>Permissão</TableHead>
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
                <TableCell className="text-right" colSpan={6}>
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
