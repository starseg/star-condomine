"use client";
import { CalendarUpdateForm } from "@/components/calendar/calendarUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProblem() {
  interface Calendar {
    lobbyCalendarId: number;
    description: string;
    date: string;
    lobbyId: number;
  }
  interface Values {
    description: string;
    date: Date | undefined;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "lobbyCalendar/find/" + params.get("id"),
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );
        setCalendar(response.data);
      } catch (error) {
        console.error("(Calendar) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (calendar) {
      let formattedDate;
      if (calendar.date) {
        formattedDate = new Date(calendar.date);
      } else {
        formattedDate = undefined;
      }
      setData({
        description: calendar?.description || "",
        date: formattedDate,
      });
    }
  }, [calendar]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Data</h1>
        {data ? <CalendarUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
