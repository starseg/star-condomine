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
import { listAccessRulesCommand } from "../device/commands";
import {
  fetchLatestResults,
  fetchLobbyData,
  sendControliDCommand,
} from "../device/search";

interface AccessRule {
  id: number;
  name: string;
}

interface IAccessRuleResult {
  device: string;
  accessrules: AccessRule[];
}

export function AccessRuleSearchInDevice() {
  const [lobbyData, setLobbyData] = useState<Lobby>();
  const [isLoading, setIsLoading] = useState(false);
  const [accessruleResult, setAccessRuleResult] = useState<IAccessRuleResult[]>([]);

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
    const devices: Array<IAccessRuleResult> = [];
    const latestResults = await fetchLatestResults(lobbyData);

    if (lobbyData && latestResults && latestResults.length > 0) {
      latestResults.map((result) => {
        try {
          const accessrules: { access_rules: AccessRule[] | [] } = JSON.parse(
            result.body.response
          );

          const filteredTimesZones = accessrules.access_rules.filter((item) => {
            return item.id !== 1;
          });

          if (filteredTimesZones.length > 0) {
            const device = lobbyData.device.find(
              (device) => device.name === result.deviceId
            );
            if (device)
              devices.push({
                device: device.description,
                accessrules: filteredTimesZones,
              });
          }
        } catch (e) {
          console.error("Erro na comunicação com o leitor");
        }
      });
    }

    return devices;
  }

  async function searchAccessRules() {
    setIsLoading(true);
    await sendControliDCommand(listAccessRulesCommand, lobbyData);
    await new Promise((resolve) => {
      setTimeout(async () => {
        setAccessRuleResult(await fetchResults());
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
          onClick={searchAccessRules}
        >
          <MagnifyingGlass />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Regras de Acesso cadastradas nos dispositivos</SheetTitle>
          <SheetDescription>
            Saiba quais regras de acesso estão vinculadas às leitoras faciais.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <p className="flex flex-1 justify-center items-center mt-12 text-lg text-primary">
            Carregando...
          </p>
        ) : (
          <>
            {accessruleResult && accessruleResult.length > 0
              ? accessruleResult.map((accessrule, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-primary my-4 p-4 border rounded-lg"
                >
                  <p className="text-lg text-primary capitalize">
                    {accessrule.device}
                  </p>
                  <ul>
                    {accessrule.accessrules.map((accessrule) => (
                      <li key={accessrule.id}>
                        {accessrule.id} - {accessrule.name}
                      </li>
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
