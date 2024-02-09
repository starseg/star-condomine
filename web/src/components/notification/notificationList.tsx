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
import { simpleDateFormat } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface Notification {
  date: string;
  title: string;
  message: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("notification", {
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BellRinging size={"2.5rem"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4">
        <ScrollArea className="h-[80vh]">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          {notifications.map((item) => (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-2 max-w-sm">
                <h4 className="text-primary font-semibold">
                  {simpleDateFormat(item.date)}
                </h4>
                <h3 className="text-xl">{item.title}</h3>
                <p>{item.message}</p>
              </DropdownMenuItem>
            </>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
