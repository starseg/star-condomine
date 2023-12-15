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
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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

export default function MemberVehicleTable({
  searchParams,
}: {
  searchParams?: {
    id?: string;
    lobby?: string;
  };
}) {
  const id = searchParams?.id || "";
  const lobby = searchParams?.lobby || "";
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      let path = "vehicle/member/" + lobby;
      const response = await api.get(path, {
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
  }, [session, searchParams]);

  const deleteAction = async (id: number) => {
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

  const deleteVehicle = async (id: number) => {
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
          <TableHead>Tipo de veículo</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Tag do veículo</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Observação</TableHead>
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
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="flex gap-4 text-2xl">
                <Link
                  href={`${type}/update?id=${member.memberId}&lobby=${lobby}`}
                >
                  <PencilLine />
                </Link>
                <button
                  onClick={() => deleteVehicle(member.memberId)}
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
          <TableCell className="text-right" colSpan={8}>
            Total de registros: {members.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
