"use client";
import { AccessUpdateForm } from "@/components/access/accessUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { format, parse } from "date-fns";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateAccess() {
  interface Access {
    accessId: number;
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

  const [access, setAccess] = useState<Access | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("access/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setAccess(response.data);
      } catch (error) {
        console.error("(Access) Erro ao obter dados:", error);
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

  let realStartDate = "";
  if (access?.startTime !== "" && access !== null) {
    const dateObject = new Date(access.startTime);
    dateObject.setHours(dateObject.getHours() - 3);
    realStartDate = format(dateObject, "yyyy-MM-dd'T'HH:mm");
  }

  let realEndDate = "";
  if (access?.startTime !== "" && access !== null) {
    const dateObject = new Date(access.startTime);
    dateObject.setHours(dateObject.getHours() - 3);
    realStartDate = format(dateObject, "yyyy-MM-dd'T'HH:mm");
  }

  useEffect(() => {
    if (access) {
      setData({
        startTime: realStartDate,
        endTime: realEndDate,
        local: access?.local || "",
        reason: access?.reason || "",
        comments: access?.comments || "",
        status: access?.status || "ACTIVE",
        member: access?.memberId || 0,
        visitor: access?.visitorId || 0,
      });
    }
  }, [access]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Acesso</h1>
        {data ? <AccessUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
