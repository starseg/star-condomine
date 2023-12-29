"use client";
import { DeviceUpdateForm } from "@/components/device/deviceUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDevice() {
  interface Device {
    deviceId: number;
    name: string;
    ip: string;
    ramal: string;
    description: string;
    deviceModelId: number;
    lobbyId: number;
    deviceModel: {
      model: string;
    };
  }
  interface Values {
    name: string;
    ip: string;
    ramal: string;
    description: string;
    model: number;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [device, setDevice] = useState<Device | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
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
        ramal: device?.ramal || "",
        description: device?.description || "",
        model: device?.deviceModelId || 0,
      });
      console.log("data:");
      console.log(data);
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
