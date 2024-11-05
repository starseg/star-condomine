"use client";
import LoadingIcon from "@/components/loadingIcon";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MemberCredentialsForm from "@/components/member/memberCredentialsForm";
import { Menu } from "@/components/menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

interface Member {
  memberId: number;
  type: string;
  name: string;
  passwordAccess: string;
  lobbyId: number;
  tag: {
    tagId: number;
    value: string;
    comments: string | null;
    status: "ACTIVE" | "INACTIVE";
    tagTypeId: number;
    memberId: number;
  }[];
}

interface ITagTypes {
  tagTypeId: number;
  description: string;
}

interface Values {
  password: string;
  tag: string;
  card: string;
}
export default function employeeCredentials() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [data, setData] = useState<Member | null>(null);
  const fetchTagData = async () => {
    try {
      const response = await api.get("member/tags/" + params.get("id"));
      setData(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  const [tagTypes, setTagTypes] = useState<ITagTypes[]>([]);
  const fetchTagTypes = async () => {
    try {
      const types = await api.get("tag/types");
      setTagTypes(types.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchTagTypes();
    fetchTagData();
  }, [session]);

  const [values, setValues] = useState<Values>();
  useEffect(() => {
    if (data) {
      setValues({
        password: data?.passwordAccess || "",
        tag: "",
        card: "",
      });
    }
  }, [data]);

  // RETORNA O ID DO TIPO DA TAG
  let tag = 0;
  let card = 0;
  tagTypes.forEach((type) => {
    if (type.description === "Tag") tag = type.tagTypeId;
    if (type.description === "Cartão") card = type.tagTypeId;
  });

  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24 px-4">
        {data && values ? (
          <>
            <h1 className="text-4xl mt-2">Credenciais</h1>
            <h2 className="text-3xl mb-4 text-primary">{data.name}</h2>

            <MemberCredentialsForm
              memberData={data}
              preloadedValues={values}
              tagId={tag}
              cardId={card}
            />
            <div className="h-8"></div>
            <Link href={`credentials/details?id=${data.memberId}`}>
              <Button className="font-semibold text-lg flex gap-2">
                <MagnifyingGlass size={24} />
                Detalhes
              </Button>
            </Link>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <LoadingIcon />
          </div>
        )}
      </section>
    </>
  );
}
