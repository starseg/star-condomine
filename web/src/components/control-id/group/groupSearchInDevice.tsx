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
import { listGroupsCommand } from "../device/commands";
import {
  fetchLatestResults,
  fetchLobbyData,
  sendControliDCommand,
} from "../device/search";

interface Group {
  id: number;
  name: string;
}

interface IGroupResult {
  device: string;
  groups: Group[];
}

export function GroupSearchInDevice() {
  const [lobbyData, setLobbyData] = useState<Lobby>();
  const [isLoading, setIsLoading] = useState(false);
  const [groupResult, setGroupResult] = useState<IGroupResult[]>([]);

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
    const devices: Array<IGroupResult> = [];
    const latestResults = await fetchLatestResults(lobbyData);
    if (lobbyData && latestResults && latestResults.length > 0) {
      latestResults.map((result) => {
        try {
          const groups: { groups: Group[] | [] } = JSON.parse(
            result.body.response
          );

          const filteredTimesZones = groups.groups.filter((item) => {
            return item.id !== 1;
          });

          if (filteredTimesZones.length > 0) {
            const device = lobbyData.device.find(
              (device) => device.name === result.deviceId
            );
            if (device)
              devices.push({
                device: device.description,
                groups: filteredTimesZones,
              });
          }
        } catch (e) {
          console.error("Erro na comunicação com o leitor");
        }
      });
    }

    return devices;
  }

  async function searchGroups() {
    setIsLoading(true);
    await sendControliDCommand(listGroupsCommand, lobbyData);
    await new Promise((resolve) => {
      setTimeout(async () => {
        setGroupResult(await fetchResults());
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
          onClick={searchGroups}
        >
          <MagnifyingGlass />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Grupos de Usuários cadastrados nos dispositivos</SheetTitle>
          <SheetDescription>
            Saiba quais grupos estão vinculados às leitoras faciais.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <p className="flex flex-1 justify-center items-center mt-12 text-lg text-primary">
            Carregando...
          </p>
        ) : (
          <div className="max-h-[80vh] overflow-y-scroll">
            {groupResult && groupResult.length > 0
              ? groupResult.map((group, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-primary my-4 p-4 border rounded-lg"
                >
                  <p className="text-lg text-primary capitalize">
                    {group.device}
                  </p>
                  <ul>
                    {group.groups.map((group) => (
                      <li key={group.id}>
                        {group.id} - {group.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
              : "Nada encontrado"}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
