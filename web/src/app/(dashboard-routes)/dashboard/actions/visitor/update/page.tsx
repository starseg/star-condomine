"use client";
import LoadingIcon from "@/components/loadingIcon";
import { VisitorUpdateForm } from "@/components/visitor/visitorUpdateForm";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateVisitor() {
  interface Visitor {
    visitorId: number;
    profileUrl: string;
    name: string;
    rg: string;
    cpf: string;
    phone: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    relation: string;
    comments: string;
    createdAt: string;
    updatedAt: string;
    visitorTypeId: number;
    visitorType: {
      visitorTypeId: number;
      description: string;
    };
  }
  interface Values {
    profileUrl: File;
    name: string;
    rg: string;
    cpf: string;
    phone: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    relation: string;
    comments: string;
    type: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("visitor/find/" + params.get("id"), {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          setVisitor(response.data);
        } catch (error) {
          console.error("(Visitor) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (visitor) {
      setData({
        profileUrl: new File([], ""),
        name: visitor?.name || "",
        cpf: visitor?.cpf || "",
        rg: visitor?.rg || "",
        phone: visitor?.phone || "",
        status: visitor?.status || "ACTIVE",
        relation: visitor?.relation || "",
        comments: visitor?.comments || "",
        type: visitor?.visitorTypeId.toString() || "",
      });
    }
  }, [visitor]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Visitante</h1>
        {visitor && data ? (
          <VisitorUpdateForm preloadedValues={data} visitor={visitor} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
