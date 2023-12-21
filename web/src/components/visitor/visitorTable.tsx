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
import { simpleDateFormat } from "@/lib/utils";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Visitor {
  visitorId: number;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: string;
  relation: string;
  createdAt: string;
  updatedAt: string;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
}

export default function VisitorTable({ lobby }: { lobby: string }) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("visitor/lobby/" + lobby, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVisitors(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("visitor/" + id, {
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

  const deleteVisitor = async (id: number) => {
    Swal.fire({
      title: "Excluir visitante?",
      text: "Isso não é recomendado, o ideal seria inativar o visitante apenas. Ele não pode ser excluído se tiver algum acesso registrado no sistema.",
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
          <TableHead>CPF</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visitors.map((visitor) => (
          <TableRow key={visitor.visitorId}>
            <TableCell>{visitor.cpf}</TableCell>
            <TableCell>{visitor.name}</TableCell>
            <TableCell>{visitor.visitorType.description}</TableCell>
            <TableCell>
              {simpleDateFormat(visitor.startDate) +
                " - " +
                simpleDateFormat(visitor.endDate)}
            </TableCell>
            <TableCell>
              {visitor.status === "ACTIVE" ? (
                <p className="text-green-500">ATIVO</p>
              ) : (
                <p className="text-red-400">INATIVO</p>
              )}
            </TableCell>
            <TableCell className="flex gap-4 text-2xl">
              <Link href={`visitors/update?id=${visitor.visitorId}`}>
                <PencilLine />
              </Link>
              <button
                onClick={() => deleteVisitor(visitor.visitorId)}
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
            Total de registros: {visitors.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
