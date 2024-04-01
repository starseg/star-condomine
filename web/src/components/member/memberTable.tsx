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
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

interface Member {
  memberId: number;
  type: string;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  comments: string;
  status: string;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: Date;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: Date;
  updatedAt: Date;
  lobbyId: number;
}

export default function MemberTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fetchData = async () => {
    const params = new URLSearchParams(searchParams);
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

  const deleteMember = async (id: number) => {
    deleteAction(session, "membro", `member/${id}`, fetchData);
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
                  <TableCell>{member.name}</TableCell>
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
                      href={`${type}/vehicles?id=${member.memberId}&lobby=${lobby}`}
                      className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                    >
                      Veículos
                    </Link>
                    <Link
                      href={`${type}/credentials?id=${member.memberId}&lobby=${lobby}`}
                      className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                    >
                      Credenciais
                    </Link>
                  </TableCell>
                  <TableCell className="flex gap-4 text-2xl">
                    <Link href={`${type}/details?id=${member.memberId}`}>
                      <MagnifyingGlass />
                    </Link>
                    <Link
                      href={`${type}/update?id=${member.memberId}&lobby=${lobby}`}
                    >
                      <PencilLine />
                    </Link>
                    <button
                      onClick={() => deleteMember(member.memberId)}
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
