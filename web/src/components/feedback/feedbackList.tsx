"use client";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle,
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Feedback {
  feedbackId: number;
  name: string;
  subject: string;
  message: string;
  response: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("feedback", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  // // console.log(feedbacks);

  const deleteAction = async (id: number) => {
    // console.log("feedback/" + id);
    try {
      await api.delete("feedback/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse feedback acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteFeedback = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir feedback?",
        text: "Essa ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43C04F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAction(id);
        }
      });
    }
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
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
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
    <section className="flex justify-center flex-wrap gap-4">
      {feedbacks.map((item) => (
        <div
          key={item.feedbackId}
          className="w-[45%] flex justify-between p-4 border border-primary rounded-md"
        >
          <div className="w-[90%]">
            {item.status === "ACTIVE" ? (
              <p className="text-blue-300 text-sm uppercase">Nova</p>
            ) : (
              <p className="text-green-300 text-sm uppercase">Visualizada</p>
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
      ))}
    </section>
  );
}
