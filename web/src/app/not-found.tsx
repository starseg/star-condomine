"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  function goBack() {
    router.back();
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-[8rem] text-primary">404</h1>
      <Image
        src="/logo.svg"
        alt="Logo Star Condomine"
        width={417}
        height={36}
        priority={true}
        className="mt-2 mb-4"
      />
      <p className="text-xl mb-8">Ops! a página requisitada não existe</p>
      <Button className="text-lg" onClick={goBack}>
        Voltar
      </Button>
    </div>
  );
}
