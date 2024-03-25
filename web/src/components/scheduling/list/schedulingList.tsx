"use client";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface SchedulingList {
  schedulingListId: number;
  description: string;
  status: string;
  createdAt: string;
  memberId: number;
  member: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
  lobbyId: number;
  lobby: {
    name: string;
  };
}

export default function SchedulingListItems() {
  const [schedulingList, setSchedulingList] = useState<SchedulingList[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "schedulingList/";
      } else {
        path = `schedulingList/filtered?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setSchedulingList(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("schedulingList/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Essa lista acabou de ser apagada.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteScheduling = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir lista?",
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
    }
  };

  return (
    <section className="flex flex-wrap gap-4">
      {schedulingList.map((item) => (
        <div
          key={item.schedulingListId}
          className="bg-stone-850 my-2 border border-primary rounded-md p-4 flex flex-col gap-2 w-[49%]"
        >
          <div className="flex justify-between gap-4">
            <p className="font-bold text-lg">Portaria: {item.lobby.name}</p>
            {item.status === "ACTIVE" ? (
              <p className="text-red-400 font-semibold">Pendente</p>
            ) : (
              <p className="text-green-400 font-semibold">Agendada</p>
            )}
          </div>
          <p>
            <span className="font-bold">Proprietário: </span> {item.member.name}
          </p>
          <p>
            <span className="font-bold">Lista: </span> <br /> {item.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-primary font-semibold">
              {formatDate(item.createdAt)} - por{" "}
              {item.operator.name.split(" ")[0]}
            </p>
            <div className="flex gap-2">
              <Link href={`schedulingList/update?id=${item.schedulingListId}`}>
                <Button
                  variant={"outline"}
                  className="p-1 aspect-square"
                  title="Editar"
                >
                  <PencilLine size={24} />
                </Button>
              </Link>
              <Button
                variant={"outline"}
                className="p-1 aspect-square"
                title="Excluir"
                onClick={() => deleteScheduling(item.schedulingListId)}
              >
                <Trash size={24} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
