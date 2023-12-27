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
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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

export default function ReportTable({ lobby }: { lobby: string }) {
  const [access, setAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("from") || !params.get("to")) {
        path = "access/report/" + lobby;
        console.log(path);
      } else {
        path = `access/report/${lobby}?from=${params.get(
          "from"
        )}&to=${params.get("to")}`;
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

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Visitante</TableHead>
          <TableHead>Visitado</TableHead>
          <TableHead>Entrada</TableHead>
          <TableHead>Saída</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Local</TableHead>
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
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.reason}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                      <p>{item.reason}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.local}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                      <p>{item.local}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={6}>
            Total de registros: {access.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
