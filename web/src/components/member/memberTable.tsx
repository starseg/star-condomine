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
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";
import { deleteFile } from "@/lib/firebase-upload";
import { Button } from "../ui/button";

export default function MemberTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [paginatedMembers, setPaginatedMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const itemsPerPage = 10;
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "member/lobby/" + lobby;
        } else {
          path = `member/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setMembers(response.data);
        setPaginatedMembers(response.data.slice(0, itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const totalOfPages = Math.ceil(members.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setPaginatedMembers(members.slice(begin, end));
  }, [page, members]);

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

  const deleteMember = async (id: number, url: string) => {
    deleteAction(session, "membro", `member/${id}`, fetchData);
    deleteFile(url);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-x-auto">
            <Table className="border border-stone-800 rouded-lg">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>
                    {members[0]
                      ? members[0].type === "RESIDENT"
                        ? "Documentos"
                        : "CPF"
                      : ""}
                  </TableHead>
                  <TableHead>
                    {members[0]
                      ? members[0].type === "RESIDENT"
                        ? "Endereço"
                        : "RG"
                      : ""}
                  </TableHead>
                  <TableHead>
                    {members[0]
                      ? members[0].type === "RESIDENT"
                        ? "Telefone"
                        : "Cargo"
                      : ""}
                  </TableHead>
                  <TableHead>Propriedades</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="uppercase">
                {paginatedMembers.map((member) => {
                  let type = "";
                  if (member.type === "RESIDENT") type = "resident";
                  else type = "employee";
                  return (
                    <TableRow key={member.memberId}>
                      <TableCell>
                        {member.comments ? (
                          member.status === "ACTIVE" ? (
                            <p className="text-yellow-400">{member.name}</p>
                          ) : (
                            <p className="text-stone-400">
                              {member.name} - inativo
                            </p>
                          )
                        ) : member.status === "ACTIVE" ? (
                          member.name
                        ) : (
                          <p className="text-stone-400">
                            {member.name} - inativo
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {type === "resident" ? (
                          <>
                            {member.cpf.length > 0 && member.cpf} <br />
                            {member.rg.length > 0 && member.rg}
                          </>
                        ) : (
                          member.cpf
                        )}
                      </TableCell>
                      <TableCell>
                        {type === "resident"
                          ? member.address
                            ? member.addressType.description +
                              " " +
                              member.address
                            : "Endereço não cadastrado"
                          : member.rg}
                      </TableCell>
                      <TableCell>
                        {type === "resident"
                          ? member.telephone.length > 0
                            ? member.telephone[0].number
                            : "Nenhum telefone cadastrado"
                          : member.position
                          ? member.position
                          : "Cargo não cadastrado"}
                      </TableCell>
                      <TableCell className="space-x-4">
                        <Link
                          href={`${type}/vehicles?id=${member.memberId}&lobby=${member.lobbyId}`}
                          className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                        >
                          Veículos
                        </Link>
                        <Link
                          href={`${type}/credentials/details?id=${member.memberId}`}
                          className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                        >
                          Credenciais
                        </Link>
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        <Link
                          href={`${type}/details?id=${member.memberId}&c=${control}`}
                        >
                          <MagnifyingGlass />
                        </Link>
                        <Link
                          href={`${type}/update?id=${member.memberId}&lobby=${lobby}&c=${control}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          onClick={() =>
                            deleteMember(member.memberId, member.profileUrl)
                          }
                          title="Excluir"
                        >
                          <Trash />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mr-4">
            <div className="mt-4 flex items-center gap-2  text-stone-400 font-medium">
              <div className="rounded-full w-6 h-6 bg-amber-400"></div>: membros
              com observações registradas
            </div>
            <div className="flex items-center gap-4 mt-2 pr-4">
              <p className="bg-stone-800 p-2 rounded">
                {members.length} registros
              </p>
              <p>
                Página {page} de {totalOfPages}
              </p>
              <div className="flex items-center text-xl gap-4">
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
          </div>
        </>
      )}
    </>
  );
}
