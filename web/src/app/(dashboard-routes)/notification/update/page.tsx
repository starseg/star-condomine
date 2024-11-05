"use client";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationUpdateForm } from "@/components/notification/notificationUpdateForm";

export default function UpdateNotification() {
  interface Notification {
    notificationId: number;
    date: string;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    status: "ACTIVE" | "INACTIVE";
  }
  interface Values {
    date: Date | undefined;
    title: string;
    message: string;
    status: "ACTIVE" | "INACTIVE";
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [notification, setNotification] = useState<Notification | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get(
            "notification/find/" + params.get("id"),
            {
              headers: {
                Authorization: `Bearer ${session?.token.user.token}`,
              },
            }
          );
          setNotification(response.data);
        } catch (error) {
          console.error("(Notification) Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  const convertStringToDate = (date: string) => {
    return date ? new Date(date) : undefined;
  };

  useEffect(() => {
    if (notification) {
      setData({
        title: notification?.title || "",
        message: notification?.message || "",
        date: convertStringToDate(notification?.date),
        status: notification?.status || "ACTIVE",
      });
    }
  }, [notification]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Notificação</h1>
        {data ? (
          <NotificationUpdateForm preloadedValues={data} />
        ) : (
          <LoadingIcon />
        )}
      </section>
    </>
  );
}
