"use client"; // Error boundaries must be Client Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="font-bold text-6xl text-primary">
        Oops! Algo deu errado!
      </h2>
      <code className="bg-stone-800 my-4 p-4 rounded-lg w-6/12">
        <span className="text-red-400">Erro: </span>
        {error.message}
      </code>
      <p className="mb-4 text-stone-300">
        Se o erro persistir após recarregar a página, contate a equipe de TI.
      </p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
