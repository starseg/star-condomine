"use client";
import { SchedulingUpdateForm } from "@/components/scheduling/schedulingUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { format, parse } from "date-fns";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProblem() {
  interface Scheduling {
    SchedulingId: number;
    startTime: string;
    endTime: string;
    local: string;
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
      cpf: string;
    };
    member: {
      name: string;
      cpf: string;
    };
  }
  interface Values {
    startTime: string;
    endTime: string;
    local: string;
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
      try {
        const response = await api.get("scheduling/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setScheduling(response.data);
      } catch (error) {
        console.error("(Scheduling) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  const dateTimeFormat = (date: string | undefined) => {
    if (date) {
      const parsedDate = parse(
        date,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        new Date()
      );
      return format(parsedDate, "yyyy-MM-dd'T'HH:mm");
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (scheduling) {
      setData({
        startTime: dateTimeFormat(scheduling?.startTime),
        endTime: dateTimeFormat(scheduling?.endTime),
        local: scheduling?.local || "",
        reason: scheduling?.reason || "",
        comments: scheduling?.comments || "",
        status: scheduling?.status || "ACTIVE",
        member: scheduling?.memberId || 0,
        visitor: scheduling?.visitorId || 0,
      });
      console.log("data:");
      console.log(data);
    }
  }, [scheduling]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Data</h1>
        {data ? (
          <SchedulingUpdateForm preloadedValues={data} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
