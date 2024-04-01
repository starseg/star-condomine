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
import { PdfButton } from "./pdfButton";
import { SkeletonTable } from "../_skeletons/skeleton-table";

interface Access {
  accessId: number;
  startTime: string;
  endTime: string;
  local: string;
  reason: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
  lobbyId: number;
  lobby: {
    name: string;
  };
}

export default function ReportTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c") || "";

  let from = params.get("from") || "";
  let to = params.get("to") || "";
  let period = { from: from, to: to };
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("from") || !params.get("to")) {
        path = "access/report/" + lobby;
        // console.log(path);
      } else {
        path = `access/report/${lobby}?from=${from}&to=${to}`;
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

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div>
          <div className="max-h-[60vh] overflow-x-auto uppercase">
            <Table className="border border-stone-800 rouded-lg">
              <TableHeader className="bg-stone-800 font-semibold sticky top-0">
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Visitado</TableHead>
                  <TableHead>Entrada</TableHead>
                  {control === "S" ? <TableHead>Saída</TableHead> : ""}
                  <TableHead>Motivo</TableHead>
                  <TableHead>Local</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {access.map((item) => {
                  return (
                    <TableRow key={item.accessId}>
                      <TableCell>
                        <p>{item.visitor.name}</p>
                      </TableCell>
                      <TableCell>
                        <p>{item.member.name}</p>
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

                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap uppercase">
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
                              <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap uppercase">
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
                  <TableCell className="text-right uppercase" colSpan={6}>
                    Total de registros: {access.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <PdfButton data={access} period={period} control={control} />
        </div>
      )}
    </>
  );
}
