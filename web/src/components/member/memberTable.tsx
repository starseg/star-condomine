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
import { useRouter } from "next/navigation";
import { type } from "os";

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
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("member/lobby/" + lobby, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  // console.log(members);

  const deleteAction = async (id: number) => {
    console.log("member/" + id);
    try {
      await api.delete("member/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse membro da portaria acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteMember = async (id: number) => {
    Swal.fire({
      title: "Excluir membro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAction(id);
      }
    });
  };

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>CPF</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Propriedades</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          let type = "";
          if (member.type === "RESIDENT") type = "resident";
          else type = "employee";
          return (
            <TableRow key={member.memberId}>
              <TableCell>{member.cpf}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>
                {member.address
                  ? member.addressType.description + " " + member.address
                  : "Endereço não cadastrado"}
              </TableCell>
              <TableCell>
                {member.telephone.length > 0
                  ? member.telephone[0].number
                  : "Nenhum telefone cadastrado"}
              </TableCell>
              <TableCell className="space-x-4">
                <Link
                  href={""}
                  className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                >
                  Veículos
                </Link>
                <Link
                  href={""}
                  className="px-3 py-1 border rounded-md hover:border-stone-50 transition-all"
                >
                  Credenciais
                </Link>
              </TableCell>
              <TableCell className="flex gap-4 text-2xl">
                <Link href={`${type}/details?id=${member.memberId}`}>
                  <MagnifyingGlass />
                </Link>
                <Link href={`${type}/update?id=${member.memberId}`}>
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
  );
}
