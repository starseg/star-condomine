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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function CredentialsFullTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tags[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobby = params.get("lobby");

  const fetchData = async () => {
    try {
      const response = await api.get(`tag/lobby/${lobby}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTags(response.data);
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
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Proprietário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.tagId}>
                <TableCell>
                  {tag.member.cpf.length > 0 ? tag.member.cpf : tag.member.rg}
                  <br />
                  {tag.member.name}
                </TableCell>
                <TableCell>{tag.type.description}</TableCell>
                <TableCell>{tag.value}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="max-w-[25ch] text-ellipsis overflow-hidden whitespace-nowrap">
                          {tag.comments ? tag.comments : "Nenhuma"}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                        <p>{tag.comments ? tag.comments : "Nenhuma"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {tag.status === "ACTIVE" ? (
                    <p className="text-green-400">Ativo</p>
                  ) : (
                    <p className="text-red-400">Inativo</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right" colSpan={6}>
                Total de registros: {tags.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
