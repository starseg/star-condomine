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
import { simpleDateFormat } from "@/lib/utils";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteNotification = async (id: number) => {
    deleteAction(session, "notificação", `notification/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
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
                    onClick={() =>
                      deleteNotification(notification.notificationId)
                    }
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
      )}
    </>
  );
}
