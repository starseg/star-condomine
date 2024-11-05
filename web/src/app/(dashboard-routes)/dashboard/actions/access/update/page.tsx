"use client";
import { AccessUpdateForm } from "@/components/access/accessUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateAccess() {
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
  const params = new URLSearchParams(searchParams.toString());

  const [access, setAccess] = useState<Access | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("access/find/" + params.get("id"),);
          setAccess(response.data);
        } catch (error) {
          console.error("(Access) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  let realStartDate = "";
  if (access?.startTime !== "" && access !== null) {
    const dateObject = new Date(access.startTime);
    dateObject.setHours(dateObject.getHours());
    realStartDate = format(dateObject, "yyyy-MM-dd'T'HH:mm");
  }

  let realEndDate = "";
  if (access?.endTime !== "" && access?.endTime !== null && access !== null) {
    const dateObject = new Date(access.endTime);
    dateObject.setHours(dateObject.getHours());
    realEndDate = format(dateObject, "yyyy-MM-dd'T'HH:mm");
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
