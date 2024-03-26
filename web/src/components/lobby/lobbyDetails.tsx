"use client";
import api from "@/lib/axios";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DetailItem from "../detailItem";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import LoadingIcon from "../loadingIcon";
import { useRouter } from "next/navigation";

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
  exitControl: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export default function LobbyDetails({ lobby }: { lobby: string }) {
  const router = useRouter();
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

  const showPermissionError = () => {
    Swal.fire({
      title: "Operação não permitida",
      text: "Sua permissão de usuário não realizar essa ação.",
      icon: "warning",
    });
  };

  const deleteLobby = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
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
          router.push("/dashboard");
        }
      });
    }
  };

  return (
    <div>
      {details ? (
        <>
          <div className="max-w-2xl mx-auto border border-primary py-4 px-12 rounded-md mt-4">
            <DetailItem label="Nome" content={details.name} />
            <DetailItem
              label="Tipo"
              content={
                details.type === "CONDOMINIUM" ? "Condomínio" : "Empresa"
              }
            />
            <DetailItem label="CNPJ" content={details.cnpj} />
            <DetailItem label="Responsável" content={details.responsible} />
            <DetailItem label="Telefone" content={details.telephone} />
            <DetailItem label="Horários" content={details.schedules} />
            <DetailItem
              label="Controle de saída"
              content={details.exitControl === "ACTIVE" ? "Sim" : "Não"}
            />
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
          <div className="max-w-2xl mx-auto py-4 flex justify-end gap-6">
            {session?.payload.user.type === "USER" ? (
              <Button
                className="text-lg w-32 bg-blue-700 hover:bg-blue-500 text-stone-50"
                onClick={showPermissionError}
              >
                <PencilLine className="mr-2" />
                Editar
              </Button>
            ) : (
              <Link href={`/dashboard/update?id=${details.lobbyId}`}>
                <Button className="text-lg w-32 bg-blue-700 hover:bg-blue-500 text-stone-50">
                  <PencilLine className="mr-2" />
                  Editar
                </Button>
              </Link>
            )}
            <Button
              className="text-lg w-32 bg-destructive hover:bg-red-400 text-destructive-foreground"
              onClick={() => deleteLobby(details.lobbyId)}
            >
              <Trash className="mr-2" />
              Excluir
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
