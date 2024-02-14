"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/lib/axios";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Notification {
  notificationId: number;
  date: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationTable() {
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

  // // console.log(devices);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("notification/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluída!",
        text: "Essa notificação acabou de ser apagada.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir notificação?",
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

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Mensagem</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.map((notification) => (
          <TableRow key={notification.notificationId}>
            <TableCell>{notification.title}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                      {notification.message}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                    <p>{notification.message}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{simpleDateFormat(notification.date)}</TableCell>
            <TableCell>
              {notification.status === "ACTIVE" ? (
                <p className="text-green-400">Ativa</p>
              ) : (
                <p className="text-red-400">Inativa</p>
              )}
            </TableCell>
            <TableCell className="flex gap-4 text-2xl">
              <Link
                href={`notification/update?id=${notification.notificationId}`}
              >
                <PencilLine />
              </Link>
              <button
                onClick={() => deleteNotification(notification.notificationId)}
                title="Excluir"
              >
                <Trash />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={6}>
            Total de registros: {notifications.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
