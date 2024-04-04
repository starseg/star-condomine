import { NotificationForm } from "@/components/notification/notificationForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificações",
};

export default function Notification() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 text-center">Criar Notificação</h1>
        <NotificationForm />
      </section>
    </>
  );
}
