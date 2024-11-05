"use client";
import { SchedulingListUpdateForm } from "@/components/scheduling/list/schedulingListUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateSchedulingList() {
  interface SchedulingList {
    schedulingListId: number;
    description: string;
    url: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    createdAt: string;
    memberId: number;
    lobbyId: number;
    operatorId: number;
    lobby: {
      name: string;
    };
    member: {
      name: string;
    };
  }
  interface Values {
    description: string;
    url: File;
    status: "ACTIVE" | "INACTIVE" | undefined;
    lobby: number;
    member: number;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [list, setList] = useState<SchedulingList | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get(
            "schedulingList/find/" + params.get("id")
          );
          setList(response.data);
        } catch (error) {
          console.error("(Scheduling List) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (list) {
      setData({
        description: list?.description || "",
        url: new File([], ""),
        status: list?.status || "ACTIVE",
        member: list?.memberId || 0,
        lobby: list?.lobbyId || 0,
      });
    }
  }, [list]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Lista</h1>
        {list && data ? (
          <SchedulingListUpdateForm preloadedValues={data} scheduling={list} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
