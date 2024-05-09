"use client";
import LoadingIcon from "@/components/loadingIcon";
import { EmployeeUpdateForm } from "@/components/member/employeeUpdateForm";
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
    accessPeriod: string;
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
    name: string;
    cpf: string;
    rg: string;
    position: string;
    accessPeriod: string;
    comments: string;
    faceAccess: boolean;
    biometricAccess: boolean;
    remoteControlAccess: boolean;
    passwordAccess: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [member, setMember] = useState<Member | null>(null);
  const [data, setData] = useState<Values>();

  function bool(value: string | undefined) {
    return value === "true";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("member/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setMember(response.data);
      } catch (error) {
        console.error("(Member) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (member) {
      setData({
        profileUrl: new File([], ""),
        name: member?.name || "",
        cpf: member?.cpf || "",
        rg: member?.rg || "",
        position: member?.position || "",
        accessPeriod: member?.accessPeriod || "",
        faceAccess: bool(member?.faceAccess) || false,
        biometricAccess: bool(member?.biometricAccess) || false,
        remoteControlAccess: bool(member?.remoteControlAccess) || false,
        passwordAccess: member?.passwordAccess || "",
        comments: member?.comments || "",
        status: member?.status || "INACTIVE",
      });
      // console.log("data:");
      // console.log(data);
    }
  }, [member]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Funcionário</h1>
        {member && data ? (
          <EmployeeUpdateForm preloadedValues={data} member={member} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
