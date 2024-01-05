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
      // console.log(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    // console.log("operator/" + id);
    try {
      await api.delete("operator/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse operador acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteOperator = async (id: number) => {
    Swal.fire({
      title: "Excluir operador?",
      text: "Isso não é recomendado, o ideal seria inativar o operador apenas. Ele não pode ser excluído se tiver alguma ação registrada no sistema.",
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
  );
}
