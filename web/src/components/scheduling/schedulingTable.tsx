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
import { formatDate, simpleDateFormat } from "@/lib/utils";
import {
  FilePlus,
  MagnifyingGlass,
  PencilLine,
  SignOut,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

interface Scheduling {
  schedulingId: number;
  startDate: string;
  endDate: string;
  location: string;
  reason: string;
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

export default function SchedulingTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduling, setScheduling] = useState<Scheduling[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const router = useRouter();
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "scheduling/lobby/" + lobby;
        // console.log(path);
      } else {
        path = `scheduling/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setScheduling(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteScheduling = async (id: number) => {
    deleteAction(session, "agendamento", `scheduling/${id}`, fetchData);
  };

  const operator = session?.payload.user.id || null;
  const registerAccess = async (
    visitor: number,
    member: number,
    reason: string,
    location: string
  ) => {
    const info = {
      visitorId: visitor,
      memberId: member,
      reason: reason,
      local: location,
      startTime: new Date().toISOString(),
      comments: "",
      operatorId: operator,
      lobbyId: Number(lobby),
    };
    try {
      await api.post("access", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      router.push(`/dashboard/actions/access?lobby=${lobby}&c=${control}`);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let currentDateUTC = currentDate.toISOString();

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
              <TableHead>Validade do acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="uppercase">
            {scheduling.map((item) => {
              return (
                <TableRow key={item.schedulingId}>
                  <TableCell>
                    <p className="max-w-[25ch]">{item.visitor.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[25ch]">{item.member.name}</p>
                  </TableCell>
                  <TableCell>
                    {item.endDate >= currentDateUTC ? (
                      <p className="text-green-400">
                        {simpleDateFormat(item.startDate) +
                          " - " +
                          simpleDateFormat(item.endDate)}
                      </p>
                    ) : (
                      <p className="text-red-500">
                        {simpleDateFormat(item.startDate) +
                          " - " +
                          simpleDateFormat(item.endDate)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.status === "ACTIVE" ? (
                      <p className="text-green-400">ATIVO</p>
                    ) : (
                      <p className="text-red-400">INATIVO</p>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-4 text-2xl">
                    {item.status === "INACTIVE" ||
                    item.endDate < currentDateUTC ? (
                      <button
                        disabled
                        title="Não disponível para registrar acesso"
                      >
                        <FilePlus className="text-muted" />
                      </button>
                    ) : (
                      <button
                        title="Registrar acesso"
                        onClick={() =>
                          registerAccess(
                            item.visitorId,
                            item.memberId,
                            item.reason,
                            item.location
                          )
                        }
                      >
                        <FilePlus />
                      </button>
                    )}
                    <Link href={`scheduling/details?id=${item.schedulingId}`}>
                      <MagnifyingGlass />
                    </Link>
                    <Link
                      href={`scheduling/update?lobby=${item.lobbyId}&id=${item.schedulingId}`}
                    >
                      <PencilLine />
                    </Link>
                    <button
                      onClick={() => deleteScheduling(item.schedulingId)}
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
                Total de registros: {scheduling.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
