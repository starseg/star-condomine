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
import {
  MagnifyingGlass,
  PencilLine,
  SignOut,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Access {
  accessId: number;
  startTime: string;
  endTime: string;
  local: string;
  reason: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  operatorId: number;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
}

export default function AccessTable({ lobby }: { lobby: string }) {
  const [access, setAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "access/lobby/" + lobby;
        console.log(path);
      } else {
        path = `access/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setAccess(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("access/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse acesso acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteAccess = async (id: number) => {
    Swal.fire({
      title: "Excluir acesso?",
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

  const registerExit = async (id: number) => {
    try {
      await api.put(
        "access/" + id,
        {
          endTime: new Date().toJSON(),
          status: "INACTIVE",
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        }
      );
      fetchData();
      Swal.fire({
        title: "Saída registrada!",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro registrar saída:", error);
    }
  };

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Visitante</TableHead>
          <TableHead>Visitado</TableHead>
          <TableHead>Data de entrada</TableHead>
          <TableHead>Data de saída</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {access.map((item) => {
          return (
            <TableRow key={item.accessId}>
              <TableCell>
                <p className="max-w-[20ch] text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-auto hover:max-w-full">
                  {item.visitor.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="max-w-[20ch] text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-auto hover:max-w-full">
                  {item.member.name}
                </p>
              </TableCell>
              <TableCell>{formatDate(item.startTime)}</TableCell>
              <TableCell>
                {item.endTime !== null && item.endTime.length > 0
                  ? formatDate(item.endTime)
                  : "Não saiu"}
              </TableCell>
              <TableCell className="flex gap-4 text-2xl">
                {item.endTime !== null && item.endTime.length > 1 ? (
                  <button
                    title="Saída registrada"
                    disabled
                    className="text-muted"
                  >
                    <SignOut />
                  </button>
                ) : (
                  <button
                    onClick={() => registerExit(item.accessId)}
                    title="Registrar saída"
                  >
                    <SignOut />
                  </button>
                )}
                <Link href={`access/details?id=${item.accessId}`}>
                  <MagnifyingGlass />
                </Link>
                <Link
                  href={`access/update?lobby=${item.lobbyId}&id=${item.accessId}`}
                >
                  <PencilLine />
                </Link>
                <button
                  onClick={() => deleteAccess(item.accessId)}
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
            Total de registros: {access.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
