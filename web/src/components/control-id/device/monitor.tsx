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
  response: string;
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="right-8 bottom-8 absolute flex justify-center items-center bg-primary hover:bg-primary/80 p-2 rounded-full w-16 h-16 text-stone-950 transition-colors">
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
                  return (
                    <div key={index}>
                      <p
                        className={
                          index === 0 ? "text-green-500" : "text-white"
                        }
                      >
                        {index} - {item.response}
                      </p>
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
