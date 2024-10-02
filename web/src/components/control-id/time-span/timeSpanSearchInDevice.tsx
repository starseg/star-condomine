import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { setTimeout } from "timers";
import { listTimeSpansCommand } from "../device/commands";
import {
  fetchLatestResults,
  fetchLobbyData,
  sendControliDCommand,
} from "../device/search";

interface TimeSpan {
  id: number;
  name: string;
}

interface ITimeSpanResult {
  device: string;
  timespans: TimeSpan[];
}

export function TimeSpanSearchInDevice() {
  const [lobbyData, setLobbyData] = useState<Lobby>();
  const [isLoading, setIsLoading] = useState(false);
  const [timespanResult, setTimeSpanResult] = useState<ITimeSpanResult[]>([]);

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  useEffect(() => {
    const fetchData = async () => {
      setLobbyData(await fetchLobbyData(session, lobby));
    };

    fetchData();
  }, [session, lobby]);

  async function fetchResults() {
    const devices: Array<ITimeSpanResult> = [];
    const latestResults = await fetchLatestResults(lobbyData);

    if (lobbyData && latestResults && latestResults.length > 0) {
      latestResults.map((result) => {
        const timespans: { time_spans: TimeSpan[] | [] } = JSON.parse(
          result.body.response
        );

        const filteredTimesSpans = timespans.time_spans.filter((item) => {
          return item.id !== 1;
        });

        if (filteredTimesSpans.length > 0) {
          const device = lobbyData.device.find(
            (device) => device.name === result.deviceId
          );
          if (device)
            devices.push({
              device: device.description,
              timespans: filteredTimesSpans,
            });
        }
      });
    }

    return devices;
  }

  async function searchTimeSpans() {
    setIsLoading(true);
    await sendControliDCommand(listTimeSpansCommand, lobbyData);
    await new Promise((resolve) => {
      setTimeout(async () => {
        setTimeSpanResult(await fetchResults());
        resolve(true);
      }, 5000);
    });
    setIsLoading(false);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="p-1 text-2xl aspect-square"
          title="Buscar nos dispositivos"
          onClick={searchTimeSpans}
        >
          <MagnifyingGlass />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Intervalos cadastrados nos dispositivos</SheetTitle>
          <SheetDescription>
            Saiba quais intervalos estão vinculados às aos seus respectivos
            horarios.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <p className="flex flex-1 justify-center items-center mt-12 text-lg text-primary">
            Carregando...
          </p>
        ) : (
          <>
            {timespanResult && timespanResult.length > 0
              ? timespanResult.map((timespan, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-primary my-4 p-4 border rounded-lg"
                >
                  <p className="text-lg text-primary capitalize">
                    {timespan.device}
                  </p>
                  <ul>
                    {timespan.timespans.map((timespan) => (
                      <li key={timespan.id}>{timespan.id}</li>
                    ))}
                  </ul>
                </div>
              ))
              : "Nada encontrado"}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
