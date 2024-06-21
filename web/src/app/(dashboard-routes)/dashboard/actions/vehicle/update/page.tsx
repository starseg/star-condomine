"use client";
import { VehicleUpdateForm } from "@/components/vehicle/vehicleUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DeviceUpdateForm } from "@/components/device/deviceUpdateForm";

export default function UpdateVehicle() {
  interface Vehicle {
    vehicleId: number;
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    tag: string;
    comments: string;
    vehicleTypeId: number;
    memberId: number;
  }
  interface Values {
    member: number;
    vehicleType: number;
    licensePlate: string;
    tag: string;
    brand: string;
    model: string;
    color: string;
    comments: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("vehicle/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setVehicle(response.data);
      } catch (error) {
        console.error("(Device) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (vehicle) {
      setData({
        member: vehicle.memberId || 0,
        vehicleType: vehicle.vehicleTypeId || 0,
        licensePlate: vehicle.licensePlate || "",
        tag: vehicle.tag || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        color: vehicle.color || "",
        comments: vehicle.comments || "",
      });
    }
  }, [vehicle]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Veículo</h1>
        {data ? <VehicleUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
