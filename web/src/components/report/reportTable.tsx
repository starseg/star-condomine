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

export default function ReportTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const control = params.get("c") || "";

  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  let period = { from: from, to: to };

  useEffect(() => {
    // Atualiza os valores de 'from' e 'to' quando os parâmetros mudam
    setFrom(params.get("from") || "");
    setTo(params.get("to") || "");
  }, [searchParams]);

  const fetchData = async () => {
    if (session && from && to) {
      // Verifica se session, from e to são válidos
      try {
        const path = `access/report/${lobby}?from=${from}&to=${to}`;
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
    } else if (session) {
      // Se não houver 'from' ou 'to', faz a requisição sem eles
      try {
        const path = `access/report/${lobby}`;
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
    }
  };

  useEffect(() => {
    if (from && to) {
      fetchData();
    }
  }, [session, from, to]);

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div>
          <div className="max-h-[60vh] uppercase overflow-x-auto">
            <Table className="border-stone-800 border rouded-lg">
              <TableHeader className="top-0 sticky bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Visitado</TableHead>
                  <TableHead>Entrada</TableHead>
                  {control === "S" ? <TableHead>Saída</TableHead> : ""}
                  <TableHead>Motivo</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Observações</TableHead>
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
                              <button className="max-w-[15ch] text-ellipsis uppercase whitespace-nowrap overflow-hidden">
                                {item.reason}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
                              <p>{item.reason}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="max-w-[15ch] text-ellipsis uppercase whitespace-nowrap overflow-hidden">
                                {item.local}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
                              <p>{item.local}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="max-w-[15ch] text-ellipsis uppercase whitespace-nowrap overflow-hidden">
                                {item.comments ? item.comments : "Nenhuma"}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
                              <p>{item.comments ? item.comments : "Nenhuma"}</p>
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
                  <TableCell className="text-right uppercase" colSpan={7}>
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
