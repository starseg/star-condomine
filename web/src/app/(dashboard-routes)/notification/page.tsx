import { Menu } from "@/components/menu";
import NotificationTable from "@/components/notification/notificationTable";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notificações",
};

export default function Feedbacks() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Notificações</h1>
        <NotificationTable />
        <div className="mt-4 flex gap-4 items-center">
          <Link
            href={`notification/new`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Criar nova
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
