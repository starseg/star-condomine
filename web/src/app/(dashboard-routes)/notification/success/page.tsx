import { FeedbackForm } from "@/components/feedback/feedbackForm";
import { Menu } from "@/components/menu";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Notificações - Sucesso",
};

export default function Feedback() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 text-center">Notificação criada!</h1>
        <Image
          src="/success-check.svg"
          alt="Mensagem de sucesso!"
          width={400}
          height={270}
          priority={true}
          className="mt-8 mb-8"
        />
        <Button className="text-lg">
          <Link href={"/dashboard"}>Voltar para a página principal</Link>
        </Button>
      </section>
    </>
  );
}
