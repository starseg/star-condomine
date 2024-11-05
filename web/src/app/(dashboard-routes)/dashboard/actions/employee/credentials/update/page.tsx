"use client";
import LoadingIcon from "@/components/loadingIcon";
import { CredentialsUpdateForm } from "@/components/member/credentialsUpdateForm";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateCredential() {
  interface Values {
    type: number;
    value: string;
    comments: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [tag, setTag] = useState<Tags | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("tag/find/" + params.get("id"), {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          setTag(response.data);
        } catch (error) {
          console.error("(Device) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (tag) {
      setData({
        type: tag?.tagTypeId || 0,
        value: tag?.value || "",
        comments: tag?.comments || "",
        status: tag?.status || "ACTIVE",
      });
    }
  }, [tag]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Credencial</h1>
        {data ? (
          <CredentialsUpdateForm preloadedValues={data} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
