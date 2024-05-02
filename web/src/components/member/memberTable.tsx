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
import {
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

export default function MemberTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "member/lobby/" + lobby;
        // console.log(path);
      } else {
        path = `member/filtered/${lobby}?query=${params.get("query")}`;
        // console.log(path);
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setMembers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteMember = async (id: number, url: string) => {
    deleteAction(session, "membro", `member/${id}`, fetchData);
    deleteFile(url);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
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
            {members.map((member) => {
              let type = "";
              if (member.type === "RESIDENT") type = "resident";
              else type = "employee";
              return (
                <TableRow key={member.memberId}>
                  <TableCell>
                    {member.comments ? (
                      <p className="text-yellow-400">{member.name}</p>
                    ) : (
                      member.name
                    )}
                  </TableCell>
                  <TableCell>{member.cpf}</TableCell>
                  <TableCell>
                    {type === "resident"
                      ? member.address
                        ? member.addressType.description + " " + member.address
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
                      href={`${type}/vehicles?id=${member.memberId}&lobby=${lobby}&c=${control}`}
                      className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                    >
                      Veículos
                    </Link>
                    <Link
                      href={`${type}/credentials?id=${member.memberId}&lobby=${lobby}&c=${control}`}
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
          <TableFooter>
            <TableRow>
              <TableCell className="text-right" colSpan={6}>
                Total de registros: {members.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
