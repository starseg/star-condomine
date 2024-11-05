"use client";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SkeletonCard } from "../_skeletons/skeleton-card";
import { deleteAction } from "@/lib/delete-action";

export default function FeedbackList() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("feedback");
        setFeedbacks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteFeedback = async (id: number) => {
    deleteAction(session, "feedback", `feedback/${id}`, fetchData);
  };

  const updateFeedback = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite essa ação",
        icon: "warning",
      });
    } else {
      try {
        await api.put(
          "feedback/" + id,
          { status: "INACTIVE" },

        );
        fetchData();
        Swal.fire({
          title: "Sucesso!",
          icon: "success",
        });
      } catch (error) {
        console.error("Erro registrar saída:", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <section className="flex justify-center flex-wrap gap-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((item) => (
              <div
                key={item.feedbackId}
                className="w-[45%] flex justify-between p-4 border border-primary rounded-md"
              >
                <div className="w-[90%]">
                  {item.status === "ACTIVE" ? (
                    <p className="text-blue-300 text-sm uppercase">Nova</p>
                  ) : (
                    <p className="text-green-300 text-sm uppercase">
                      Visualizada
                    </p>
                  )}
                  <p className="text-primary">Nome: {item.name}</p>
                  <p>Assunto: {item.subject}</p>
                  <p className="py-4">Mensagem: {item.message}</p>
                  <p className="text-primary">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-4 text-2xl">
                  {/* <Link href={`feedback/update?id=${item.feedbackId}`}>
              <MagnifyingGlass />
            </Link> */}
                  {item.status === "ACTIVE" ? (
                    <button
                      onClick={() => updateFeedback(item.feedbackId)}
                      title="Marcar como lido"
                    >
                      <CheckCircle />
                    </button>
                  ) : (
                    <CheckCircle className="text-muted" />
                  )}
                  <button
                    onClick={() => deleteFeedback(item.feedbackId)}
                    title="Excluir"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-4 space-y-2">
              <img
                className="w-64"
                src="undraw_location_search.svg"
                alt="Not found"
              />
              <p className="text-primary text-xl">
                Sem feedbacks por enquanto...
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
