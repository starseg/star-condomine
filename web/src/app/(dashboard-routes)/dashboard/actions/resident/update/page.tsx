"use client";
import LoadingIcon from "@/components/loadingIcon";
import { ResidentUpdateForm } from "@/components/member/residentUpdateForm";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateResident() {
  interface Member {
    memberId: number;
    type: string;
    profileUrl: string;
    documentUrl: string | null;
    name: string;
    rg: string;
    cpf: string;
    email: string;
    comments: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
    faceAccess: string;
    biometricAccess: string;
    remoteControlAccess: string;
    passwordAccess: string;
    addressTypeId: number;
    addressType: {
      addressTypeId: number;
      description: string;
    };
    address: string;
    accessPeriod: Date;
    telephone: {
      telephoneId: number;
      number: string;
    }[];
    position: string;
    createdAt: string;
    updatedAt: string;
    lobbyId: number;
  }
  interface Values {
    profileUrl: File;
    documentUrl: File;
    name: string;
    cpf: string;
    rg: string;
    email: string;
    addressType: number;
    address: string;
    comments: string;
    faceAccess: boolean;
    biometricAccess: boolean;
    remoteControlAccess: boolean;
    passwordAccess: string;
    telephone: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  interface Telephone {
    telephoneId: number;
    number: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [member, setMember] = useState<Member | null>(null);
  const [phones, setPhones] = useState<Telephone[] | null>(null);
  const [data, setData] = useState<Values>();
  const [devices, setDevices] = useState<Device[]>([]);

  function bool(value: string | undefined) {
    return value === "true";
  }

  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("member/find/" + params.get("id"));
        setMember(response.data);
      } catch (error) {
        console.error("(Member) Erro ao obter dados:", error);
      }
  };
  const fetchTelephoneData = async () => {
    if (session)
      try {
        const response = await api.get("telephone/member/" + params.get("id"));
        setPhones(response.data);
      } catch (error) {
        console.error("(Phone) Erro ao obter dados:", error);
      }
  };

  const fetchDevices = async () => {
    if (session)
      try {
        const devices = await api.get(`/device/lobby/${params.get("lobby")}`);
        setDevices(devices.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchData();
    fetchTelephoneData();
    fetchDevices();
  }, [session]);

  useEffect(() => {
    if (member) {
      setData({
        profileUrl: new File([], ""),
        documentUrl: new File([], ""),
        name: member?.name || "",
        cpf: member?.cpf || "",
        rg: member?.rg || "",
        email: member?.email || "",
        addressType: member?.addressTypeId || 0,
        address: member?.address || "",
        faceAccess: bool(member?.faceAccess) || false,
        biometricAccess: bool(member?.biometricAccess) || false,
        remoteControlAccess: bool(member?.remoteControlAccess) || false,
        comments: member?.comments || "",
        passwordAccess: member?.passwordAccess || "",
        telephone: "",
        status: member?.status || "INACTIVE",
      });
    }
  }, [member]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="mt-2 mb-4 text-4xl">Atualizar Morador</h1>
        {member && data && phones ? (
          <ResidentUpdateForm
            preloadedValues={data}
            member={member}
            phones={phones}
            devices={devices}
          />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
