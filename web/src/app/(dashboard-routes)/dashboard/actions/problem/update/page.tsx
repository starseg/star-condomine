"use client";
import { ProblemUpdateForm } from "@/components/problem/problemUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";

export default function UpdateProblem() {
  interface Problem {
    lobbyProblemId: number;
    title: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    lobbyId: number;
    operatorId: number;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  interface Values {
    title: string;
    description: string;
    date: string;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "lobbyProblem/find/" + params.get("id"),
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );
        setProblem(response.data);
      } catch (error) {
        console.error("(Problem) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  let realDate = "";
  if (problem?.date !== "" && problem !== null) {
    const dateObject = new Date(problem.date);
    dateObject.setHours(dateObject.getHours());
    realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm");
  }

  useEffect(() => {
    if (problem) {
      setData({
        title: problem?.title || "",
        description: problem?.description || "",
        date: realDate,
        status: problem?.status || "ACTIVE",
      });
      // console.log("data:");
      // console.log(data);
    }
  }, [problem]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Problema</h1>
        {data ? <ProblemUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
