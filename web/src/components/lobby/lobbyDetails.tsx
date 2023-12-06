"use client";
import api from "@/lib/axios";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DetailItem from "./detailItem";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";

interface Lobby {
  lobbyId: number;
  cnpj: string;
  name: string;
  responsible: string;
  telephone: string;
  schedules: string;
  procedures: string;
  datasheet: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function LobbyDetails({ lobby }: { lobby: string }) {
  const [details, setDetails] = useState<Lobby>();
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("lobby/find/" + lobby, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setDetails(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("lobby/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluída!",
        text: "Essa portaria acabou de ser apagada.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteLobby = async (id: number) => {
    Swal.fire({
      title: "Excluir portaria?",
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
    <div>
      {details ? (
        <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md">
          <DetailItem label="Nome" content={details.name} />
          <DetailItem
            label="Tipo"
            content={details.type === "CONDOMINIUM" ? "Condomínio" : "Empresa"}
          />
          <DetailItem label="CNPJ" content={details.cnpj} />
          <DetailItem label="Responsável" content={details.responsible} />
          <DetailItem label="Telefone" content={details.telephone} />
          <DetailItem label="Horários" content={details.schedules} />
          <DetailItem
            label="Procedimentos gerais"
            content={
              details.procedures ? details.procedures : "Não especificados"
            }
          />
          <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
          <DetailItem label="CEP" content={details.cep} />
          <DetailItem label="Estado" content={details.state} />
          <DetailItem label="Cidade" content={details.city} />
          <DetailItem label="Bairro" content={details.neighborhood} />
          <DetailItem label="Rua" content={details.street} />
          <DetailItem label="Número" content={details.number} />
          <DetailItem
            label="Complemento"
            content={details.complement ? details.complement : "Não há"}
          />
          <div className="h-[1px] w-full bg-primary mt-8 mb-4"></div>
          <DetailItem
            label="Data do registro"
            content={formatDate(details.createdAt)}
          />
          <DetailItem
            label="Última atualização"
            content={formatDate(details.updatedAt)}
          />

          {details.datasheet ? (
            <Link target="_blank" href={`${details.datasheet}`}>
              <Button className="text-lg">Ficha técnica</Button>
            </Link>
          ) : (
            <p>Essa portaria não tem uma ficha técnica</p>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
