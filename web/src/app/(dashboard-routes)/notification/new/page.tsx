import { NotificationForm } from "@/components/notification/notificationForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificações",
};

export default function Notification() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="mt-2 text-4xl text-center">Criar Notificação</h1>
        <NotificationForm />
      </section>
    </>
  );
}
