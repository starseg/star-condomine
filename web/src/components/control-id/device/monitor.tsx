"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ControlIdResult {
  deviceId: string;
  timestamp: number;
  body: {
    response?: string;
    error?: string;
  };
}

export function Monitor() {
  const { data: session } = useSession();
  const [controlIdResults, setControlIdResults] = useState<ControlIdResult[]>(
    []
  );
  const [isWatching, setIsWatching] = useState(false);

  const fetchControlIdResults = async () => {
    if (session)
      try {
        const response = await api.get(`/control-id/results`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setControlIdResults(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    if (isWatching) {
      const intervalId = setInterval(() => {
        fetchControlIdResults();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isWatching, session]);

  function responseDictionary(response: string): JSX.Element {
    if (response.startsWith(`{"ids":`)) {
      return <p className="text-green-500">Criado com sucesso</p>;
    }

    if (response.startsWith(`{"changes":`)) {
      const changes = response.split(":")[1].slice(0, -1);
      if (Number(changes) === 0) {
        return <p className="text-stone-300">Nenhuma mudança aplicada</p>;
      } else {
        return <p className="text-green-500">Mudanças aplicadas: {changes}</p>;
      }
    }

    if (response.startsWith(`{"user_image":`)) {
      return <p className="text-green-500">Imagem registrada pela câmera</p>;
    }

    if (response.endsWith(`"success":true}]}`)) {
      return <p className="text-green-500">Foto cadastrada</p>;
    }

    if (response.includes(`"success":false`)) {
      if (response.includes(`"message":"Face exists"`)) {
        return <p className="text-red-500">Foto já pertence a outro usuário</p>;
      }

      if (response.includes(`"message":Failed: Image file not recognized"`)) {
        return (
          <p className="text-red-500">
            A imagem não foi reconhecida, tente enviar um arquivo PNG ou JPG
          </p>
        );
      }

      if (
        response.includes(`"message":"Face pose not centered"`) ||
        response.includes(`"message":"Face not centered"`)
      ) {
        return <p className="text-red-500">A face não está centralizada</p>;
      }

      if (response.includes(`"message":"Low sharpness"`)) {
        return (
          <p className="text-red-500">A qualidade da imagem está muito baixa</p>
        );
      }

      if (
        response.includes(`"message":"Face too close"`) ||
        response.includes(`"message:"Face too distant"`)
      ) {
        return (
          <p className="text-red-500">
            A foto está muito longe ou muito perto da camera
          </p>
        );
      }

      if (response.includes(`"message":"Face not detected"`)) {
        return (
          <p className="text-red-500">
            Não foi possivel detectar um rosto na foto
          </p>
        );
      }

      return (
        <p className="text-red-500">
          Foto não cadastrada, tente sincronizar novamente
        </p>
      );
    }

    if (response.startsWith(`{"users":[{"id":`)) {
      return <p className="text-green-500">Usuário encontrado</p>;
    }

    if (
      response.startsWith(`{"time_zones":[`) ||
      response.startsWith(`{"access_rules":[`) ||
      response.startsWith(`{"groups":[`) ||
      response.startsWith(`{"time_spans":[`) ||
      response.startsWith(`{"access_logs":[`)
    ) {
      return <p className="text-green-500">Busca realizada com sucesso</p>;
    }

    if (response.startsWith(`{"users":[]}`)) {
      return <p className="text-red-500">Nenhum usuário foi encontrado</p>;
    }

    return <p>{response}</p>;
  }
  function errorDictionary(error: string): JSX.Element {
    if (error.startsWith(`constraint failed: UNIQUE constraint failed`)) {
      return <p className="text-red-500">Dado já cadastrado</p>;
    }

    if (error === `constraint failed: FOREIGN KEY constraint failed`) {
      return (
        <p className="text-red-500">
          Algum dado deste registro deveria ter sido cadastrado antes deste
        </p>
      );
    }

    return <p>{error}</p>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="right-8 bottom-8 fixed flex justify-center items-center bg-primary hover:bg-primary/80 p-2 rounded-full w-16 h-16 text-stone-950 transition-colors">
          Monitor
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Monitor Control iD</SheetTitle>
          <SheetDescription>
            Monitore as respostas dos dispositivos
          </SheetDescription>
          <Button onClick={() => setIsWatching(!isWatching)}>
            {isWatching ? "Parar" : "Assistir"}
          </Button>
          <div className="space-y-2 bg-stone-900 p-2 border rounded max-h-[85vh] break-words overflow-y-auto">
            {controlIdResults.length > 0 ? (
              controlIdResults
                .slice()
                .reverse()
                .map((item, index) => {
                  const date = new Date(item.timestamp).toLocaleDateString();
                  const time = new Date(item.timestamp).toLocaleTimeString();

                  return (
                    <div key={index}>
                      {item.body.response && (
                        <div>
                          {responseDictionary(item.body.response)}
                          <span className="text-gray-400 text-sm">
                            {date} - {time}
                          </span>
                        </div>
                      )}

                      {item.body.error && (
                        <div>
                          {errorDictionary(item.body.error)}
                          <span className="text-gray-400 text-sm">
                            {date} - {time}
                          </span>
                        </div>
                      )}
                      <DropdownMenuSeparator />
                    </div>
                  );
                })
            ) : (
              <div className="flex justify-center items-center h-[80vh] text-center">
                {isWatching ? "Carregando..." : ""}
              </div>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
