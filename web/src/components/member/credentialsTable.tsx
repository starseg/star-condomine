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
import { deleteAction } from "@/lib/delete-action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function CredentialsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tags[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const id = params.get("id");

  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get(`tag/member/${id}`);
        setTags(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteCredential = async (id: number) => {
    deleteAction(session, "credencial", `tag/id/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.tagId}>
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
                <TableCell className="flex gap-4 text-2xl">
                  <Link href={`update?id=${tag.tagId}`}>
                    <PencilLine />
                  </Link>
                  <button
                    onClick={() => deleteCredential(tag.tagId)}
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
                Total de registros: {tags.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
