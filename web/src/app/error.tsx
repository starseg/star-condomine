"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  })

  return (
    <div className="h-screen mx-auto flex flex-col justify-center gap-12 w-3/4">
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="font-bold text-6xl text-primary">Oops! Algo deu errado!</h2>

        <p className="mb-4 mt-4 text-stone-300">
          Se o erro persistir após recarregar a página, contate a equipe de TI.
        </p>

        <Button onClick={() => reset()} className="mb-4">Tentar novamente</Button>
      </div>
      <div className="flex flex-col">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="mb-1"
        >
          {showDetails ?
            (
              <div className="flex gap-2">
                <ArrowDown className="text-gray-500" />
                <span className="text-gray-500 underline underline-offset-2">Esconder detalhes do erro</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <ArrowRight className="text-gray-500" />
                <span className="text-gray-500 underline underline-offset-2">Mostrar detalhes do erro</span>
              </div>
            )}
        </button>

        {showDetails && (
          <code className="bg-stone-800 my-4 p-4 rounded-lg w-full flex flex-col gap-3">

            <div className="flex gap-2 flex-wrap">
              <span className="text-red-400">Nome do Erro: </span>
              {error.name.length > 90 ? `${error.name.substring(0, 90)}...` : error.name}
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-red-400">Mensagem de Erro: </span>
              {error.message.length > 90 ? `${error.message.substring(0, 90)}...` : error.message}
            </div>

            {error.stack && (
              <div className="flex gap-2">
                <span className="text-red-400">Log completo: </span>
                {error?.stack?.length > 90 ? `${error.stack.substring(0, 90)}...` : error.stack}
              </div>
            )}
          </code>
        )}
      </div>
    </div>
  );
}
