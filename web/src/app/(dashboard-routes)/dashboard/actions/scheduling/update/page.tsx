"use client";
import { SchedulingUpdateForm } from "@/components/scheduling/schedulingUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { format, parse } from "date-fns";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateScheduling() {
  interface Scheduling {
    SchedulingId: number;
    startDate: string;
    endDate: string;
    location: string;
    reason: string;
    comments: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    createdAt: string;
    updatedAt: string;
    memberId: number;
    visitorId: number;
    lobbyId: number;
    operatorId: number;
    visitor: {
      name: string;
    };
    member: {
      name: string;
    };
  }
  interface Values {
    startDate: Date | undefined;
    endDate: Date | undefined;
    location: string;
    reason: string;
    comments: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    member: number;
    visitor: number;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [scheduling, setScheduling] = useState<Scheduling | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get(
            "scheduling/find/" + params.get("id"),
            {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            }
          );
          setScheduling(response.data);
        } catch (error) {
          console.error("(Scheduling) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  const convertStringToDate = (date: string) => {
    return date ? new Date(date) : undefined;
  };

  useEffect(() => {
    if (scheduling) {
      setData({
        startDate: convertStringToDate(scheduling?.startDate),
        endDate: convertStringToDate(scheduling?.endDate),
        location: scheduling?.location || "",
        reason: scheduling?.reason || "",
        status: scheduling?.status || "ACTIVE",
        comments: scheduling?.comments || "",
        member: scheduling?.memberId || 0,
        visitor: scheduling?.visitorId || 0,
      });
    }
  }, [scheduling]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Agendamento</h1>
        {data ? (
          <SchedulingUpdateForm preloadedValues={data} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
