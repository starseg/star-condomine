"use client";
import { DeviceUpdateForm } from "@/components/device/deviceUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDevice() {
  interface Values {
    name: string;
    ip: string;
    ramal: string;
    description: string;
    model: number;
    status: "Ativo" | "Inativo";
    login: string;
    password: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [device, setDevice] = useState<Device | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("device/find/" + params.get("id"), {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          setDevice(response.data);
        } catch (error) {
          console.error("(Device) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (device) {
      setData({
        name: device?.name || "",
        ip: device?.ip || "",
        ramal: device?.ramal.toString() || "",
        description: device?.description || "",
        status: device?.status == "ACTIVE" ? "Ativo" : "Inativo",
        model: device?.deviceModelId || 0,
        login: device?.login || "",
        password: device?.password || "",
      });
    }
  }, [device]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Dispositivo</h1>
        {data ? <DeviceUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
