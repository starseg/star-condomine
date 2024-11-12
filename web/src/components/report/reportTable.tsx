"use client";
import {
  Table,
  TableBody,
  TableCell,
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
import { Input } from "../ui/input";
import {
  CaretLeft,
  CaretRight,
  Funnel,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";

export default function ReportTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<Access[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccess, setFilteredAccess] = useState<Access[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const control = params.get("c") || "";

  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  let period = { from: from, to: to };

  const [page, setPage] = useState(1);
  const [paginatedAccess, setPaginatedAccess] = useState<Access[]>([]);
  const itemsPerPage = 50;

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
        const response = await api.get(path);
        setAccess(response.data);
        setFilteredAccess(response.data);
        setPaginatedAccess(response.data.slice(0, itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    } else if (session) {
      // Se não houver 'from' ou 'to', faz a requisição sem eles
      try {
        const path = `access/report/${lobby}`;
        const response = await api.get(path);
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

  const totalOfPages = Math.ceil(filteredAccess.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedAccess(filteredAccess.slice(begin, end));
  }, [page, filteredAccess]);

  const changePage = (operation: string) => {
    setPage((prevPage) => {
      if (operation === "+" && prevPage < totalOfPages) {
        return prevPage + 1;
      } else if (operation === "-" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  function filterDataByName() {
    const filtered = access.filter(
      (item) =>
        item.visitor.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
        item.member.name.toUpperCase().includes(searchTerm.toUpperCase())
    );
    setFilteredAccess(filtered);
    setPage(1);
    setPaginatedAccess(filtered.slice(0, itemsPerPage));
  }

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
                {paginatedAccess.map((item) => {
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
            </Table>
          </div>
          <div className="flex justify-between items-center gap-4 mt-4">
            <div className="flex justify-center items-center gap-2">
              <Funnel size={40} />
              <Input
                type="text"
                placeholder="Filtrar por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button
                variant={"outline"}
                onClick={filterDataByName}
                className="p-2"
                title="Pesquisar"
              >
                <MagnifyingGlass size={20} />
              </Button>
            </div>
            <div className="flex justify-center items-center gap-2 mr-4">
              <div className="flex items-center gap-4 pr-4">
                <p className="bg-stone-800 p-2 rounded">
                  {filteredAccess.length} registros
                </p>
                <p>
                  Página {page} de {totalOfPages}
                </p>
                <div className="flex items-center gap-4 text-xl">
                  <Button
                    variant={"outline"}
                    className="p-0 aspect-square"
                    title="Anterior"
                    disabled={page === 1}
                    onClick={() => changePage("-")}
                  >
                    <CaretLeft />
                  </Button>
                  <Button
                    variant={"outline"}
                    className="p-0 aspect-square"
                    title="Próxima"
                    disabled={page === totalOfPages}
                    onClick={() => changePage("+")}
                  >
                    <CaretRight />
                  </Button>
                </div>
              </div>
              <PdfButton
                data={filteredAccess}
                period={period}
                control={control}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
