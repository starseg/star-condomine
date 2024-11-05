"use client";
import { DeviceModelUpdateForm } from "@/components/device/model/deviceModelUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateDeviceModel() {
  interface Values {
    model: string;
    brand: string;
    description: string;
    isFacial: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get(
            "deviceModel/find/" + params.get("id")
          );
          setDeviceModel(response.data);
        } catch (error) {
          console.error("(DeviceModel) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (deviceModel) {
      setData({
        model: deviceModel?.model || "",
        brand: deviceModel?.brand || "",
        description: deviceModel?.description || "",
        isFacial: deviceModel?.isFacial || "",
      });
    }
  }, [deviceModel]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Dispositivo</h1>
        {data ? (
          <DeviceModelUpdateForm preloadedValues={data} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
