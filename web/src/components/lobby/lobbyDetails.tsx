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
import { deleteFile } from "@/lib/firebase-upload";

export default function LobbyDetails({ lobby }: { lobby: string }) {
  const router = useRouter();
  const [details, setDetails] = useState<Lobby>();
  const { data: session } = useSession();
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("lobby/find/" + lobby);
        setDetails(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const showPermissionError = () => {
    Swal.fire({
      title: "Operação não permitida",
      text: "Sua permissão de usuário não realizar essa ação.",
      icon: "warning",
    });
  };

  const deleteLobby = async (id: number, url: string) => {
    if (
      session?.payload.user.type === "USER" ||
      session?.payload.user.lobbyId
    ) {
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete("lobby/" + id);
            fetchData();
            Swal.fire({
              title: "Excluída!",
              text: "Essa portaria acabou de ser apagada.",
              icon: "success",
            });
          } catch (error) {
            console.error("Erro excluir dado:", error);
          }
          router.push("/dashboard");
        }
      });
      deleteFile(url);
    }
  };

  return (
    <div>
      {details ? (
        <>
          <div className="border-primary mx-auto mt-4 px-12 py-4 border rounded-md max-w-2xl">
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

            {session?.payload.user.type === "ADMIN" && (
              <DetailItem
                label="Portaria apenas para administradores"
                content={details.protection === "ACTIVE" ? "Sim" : "Não"}
              />
            )}

            <DetailItem
              label="Procedimentos gerais"
              content={
                details.procedures ? details.procedures : "Não especificados"
              }
            />
            <DetailItem
              label="Código de acesso"
              content={details.code.toString() || ""}
            />
            <DetailItem
              label="Marca dos dispositivos"
              content={details.ControllerBrand.name || ""}
            />
            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
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
            <div className="bg-primary mt-8 mb-4 w-full h-[1px]"></div>
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
          <div className="flex justify-end gap-6 mx-auto py-4 max-w-2xl">
            {session?.payload.user.type === "USER" ? (
              <Button
                className="bg-blue-700 hover:bg-blue-500 w-32 text-lg text-stone-50"
                onClick={showPermissionError}
              >
                <PencilLine className="mr-2" />
                Editar
              </Button>
            ) : (
              <Link href={`/dashboard/update?id=${details.lobbyId}`}>
                <Button className="bg-blue-700 hover:bg-blue-500 w-32 text-lg text-stone-50">
                  <PencilLine className="mr-2" />
                  Editar
                </Button>
              </Link>
            )}
            <Button
              className="bg-destructive hover:bg-red-400 w-32 text-destructive-foreground text-lg"
              onClick={() => deleteLobby(details.lobbyId, details.datasheet)}
            >
              <Trash className="mr-2" />
              Excluir
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
