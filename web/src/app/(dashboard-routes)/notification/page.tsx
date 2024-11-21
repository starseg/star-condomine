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
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <h1 className="mb-2 text-4xl text-center">Notificações</h1>
        <NotificationTable />
        <div className="flex items-center gap-4 mt-4">
          <Link
            href={`notification/new`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Criar nova
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
