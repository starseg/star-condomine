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
        src="/logo.png"
        alt="Logo Star Condomine"
        width={453}
        height={74}
        priority={true}
      />
      <p className="text-xl mb-8">Ops! a página requisitada não existe</p>
      <Button onClick={goBack}>Voltar</Button>
    </div>
  );
}
