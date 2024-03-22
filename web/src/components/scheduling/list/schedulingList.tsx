"use client";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
        path = "schedulinglist/";
      } else {
        path = `schedulinglist/filtered?query=${params.get("query")}`;
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

  return (
    <section className="flex flex-wrap gap-4">
      {schedulingList.map((item) => (
        <div className="bg-stone-850 my-2 border border-primary rounded-md p-4 flex flex-col gap-2 w-[49%]">
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
              Data de criação: {formatDate(item.createdAt)}
            </p>
            <Button>Editar</Button>
          </div>
        </div>
      ))}
    </section>
  );
}
