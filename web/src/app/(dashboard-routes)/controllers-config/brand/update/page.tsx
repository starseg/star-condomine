"use client";
import { BrandUpdateForm } from "@/components/controllers-config/brandUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateBrand() {
  interface Values {
    name: string;
    iconUrl: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [brand, setBrand] = useState<Brand | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("brand/find/" + params.get("id"), {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          setBrand(response.data);
        } catch (error) {
          console.error("(Brand) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (brand) {
      setData({
        name: brand?.name || "",
        iconUrl: brand?.iconUrl || "",
      });
    }
  }, [brand]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Marca</h1>
        {data ? <BrandUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
