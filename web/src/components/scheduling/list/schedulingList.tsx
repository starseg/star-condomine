"use client";
import { SkeletonCard } from "@/components/_skeletons/skeleton-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { deleteAction } from "@/lib/delete-action";
import { formatDate } from "@/lib/utils";
import {
  DownloadSimple,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SchedulingListItems() {
  const [isLoading, setIsLoading] = useState(true);
  const [schedulingList, setSchedulingList] = useState<SchedulingList[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "schedulingList";
        } else {
          path = `schedulingList/filtered?query=${params.get("query")}`;
        }
        const response = await api.get(path);
        setSchedulingList(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteScheduling = async (id: number) => {
    deleteAction(
      session,
      "lista de agendamento",
      `schedulingList/${id}`,
      fetchData
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <section className="flex flex-wrap gap-4">
          {schedulingList.map((item) => (
            <div
              key={item.schedulingListId}
              className="flex flex-col gap-2 border-primary bg-stone-850 p-4 border rounded-md w-full lg:w-[49%]"
            >
              <div className="flex justify-between gap-4">
                <p className="font-bold text-lg">Portaria: {item.lobby.name}</p>
                {item.status === "ACTIVE" ? (
                  <p className="font-semibold text-red-400">Pendente</p>
                ) : (
                  <p className="font-semibold text-green-400">Agendada</p>
                )}
              </div>
              <p>
                <span className="font-bold">Proprietário: </span>{" "}
                {item.member.name}
              </p>
              <span className="font-bold">Lista: </span>
              <Textarea
                disabled
                className="disabled:opacity-100 disabled:cursor-text"
                value={item.description}
              ></Textarea>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-primary">
                  {formatDate(item.createdAt)} - por{" "}
                  {item.operator.name.split(" ")[0]}
                </p>
                <div className="flex gap-2">
                  {item.url.length > 0 && (
                    <Link href={item.url} target="_blank">
                      <Button
                        variant={"outline"}
                        className="p-1 aspect-square"
                        title="Arquivo"
                      >
                        <DownloadSimple size={24} />
                      </Button>
                    </Link>
                  )}
                  <Link
                    href={`schedulingList/update?id=${item.schedulingListId}`}
                  >
                    <Button
                      variant={"outline"}
                      className="p-1 aspect-square"
                      title="Editar"
                    >
                      <PencilLine size={24} />
                    </Button>
                  </Link>
                  <Button
                    variant={"outline"}
                    className="p-1 aspect-square"
                    title="Excluir"
                    onClick={() => deleteScheduling(item.schedulingListId)}
                  >
                    <Trash size={24} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
