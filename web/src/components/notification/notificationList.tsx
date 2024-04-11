import { BellRinging } from "@phosphor-icons/react/dist/ssr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { cn, simpleDateFormat } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface Notification {
  notificationId: number;
  date: string;
  title: string;
  message: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("notification/active", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);
  const [newNotification, setNewNotification] = useState(0);

  function isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();

    // Convertendo ambas as datas para strings no formato yyyy-MM-dd
    const formattedDate = date.toISOString().split("T")[0];
    const formattedToday = today.toISOString().split("T")[0];

    return formattedDate === formattedToday;
  }
  useEffect(() => {
    const newNotificationCount = notifications.reduce((count, item) => {
      if (isToday(item.date)) {
        return count + 1;
      }
      return count;
    }, 0);
    setNewNotification(newNotificationCount);
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex">
        <BellRinging
          size={"2.5rem"}
          weight={newNotification > 0 ? "fill" : "regular"}
          className="text-primary"
        />
        <div className="text-xs font-bold flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500 text-stone-950">
          {newNotification}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4">
        <ScrollArea className="h-[80vh]">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          {notifications.map((item) => {
            return (
              <div key={item.notificationId}>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-2 max-w-sm">
                  <h4 className="text-primary font-semibold">
                    {simpleDateFormat(item.date)}
                  </h4>
                  <h3 className="text-xl">{item.title}</h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.message.replace(/\n/g, "<br/>"),
                    }}
                  ></p>
                </DropdownMenuItem>
              </div>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
