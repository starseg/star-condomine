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
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function OldAccessTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");

  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "access/lobby/" + lobby;
      } else {
        path = `access/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setAccess(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteAccess = async (id: number) => {
    deleteAction(session, "acesso", `access/${id}`, fetchData);
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

  const duplicateEntries: Record<number, Access[]> = {};

  // Identificar registros duplicados sem data de saída
  access.forEach((item: Access) => {
    if (!item.endTime) {
      if (!duplicateEntries[item.visitorId]) {
        duplicateEntries[item.visitorId] = [];
      }
      duplicateEntries[item.visitorId].push(item);
    }
  });

  // Objeto para armazenar os registros mais antigos entre os duplicados
  const oldestEntries: Record<number, Access> = {};
  Object.values(duplicateEntries).forEach((entries) => {
    entries.forEach((entry) => {
      if (
        !oldestEntries[entry.visitorId] ||
        new Date(entry.startTime) <
          new Date(oldestEntries[entry.visitorId].startTime)
      ) {
        oldestEntries[entry.visitorId] = entry;
      }
    });
  });

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Visitante</TableHead>
              <TableHead>Visitado</TableHead>
              <TableHead>Data de entrada</TableHead>
              {control === "S" ? <TableHead>Data de saída</TableHead> : ""}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="uppercase">
            {access.map((item) => {
              const isOldestEntry: boolean =
                oldestEntries[item.visitorId] &&
                control === "S" &&
                oldestEntries[item.visitorId].accessId === item.accessId;
              const nameStyle: React.CSSProperties = isOldestEntry
                ? { color: "#f87171", fontWeight: "bold" }
                : {};
              return (
                <TableRow key={item.accessId} style={nameStyle}>
                  <TableCell>
                    <p className="max-w-[25ch]">
                      {item.visitor.name !== null
                        ? item.visitor.name
                        : "desconhecido"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[25ch]">{item.member.name}</p>
                  </TableCell>
                  <TableCell>{formatDate(item.startTime)}</TableCell>
                  {control === "S" ? (
                    <TableCell>
                      {item.endTime !== null && item.endTime.length > 0
                        ? formatDate(item.endTime)
                        : "Não saiu"}
                    </TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell className="flex gap-4 text-2xl">
                    {control === "S" ? (
                      item.endTime !== null && item.endTime.length > 1 ? (
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
                      )
                    ) : (
                      ""
                    )}
                    <Link
                      href={`access/details?id=${item.accessId}&c=${control}`}
                    >
                      <MagnifyingGlass />
                    </Link>
                    <Link
                      href={`access/update?lobby=${item.lobbyId}&id=${item.accessId}&c=${control}`}
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
      )}
    </>
  );
}
