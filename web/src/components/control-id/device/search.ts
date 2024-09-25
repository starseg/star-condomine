import api from "@/lib/axios";
import { Session } from "next-auth";

export async function fetchLobbyData(
  session: Session | null,
  lobby: number | null
) {
  if (session)
    try {
      const getLobby = await api.get(`/lobby/find/${lobby}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      return getLobby.data;
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
}

export async function sendControliDCommand(
  command: object,
  lobbyData: Lobby | undefined
) {
  try {
    if (lobbyData && lobbyData.ControllerBrand.name === "Control iD") {
      lobbyData.device.map(async (device) => {
        await api.post(`/control-id/add-command?id=${device.name}`, command);
      });
    } else {
      console.log("Não é uma portaria com Control iD");
    }
  } catch (error) {
    console.error("Error sending command:", error);
  }
}

interface PushResponse {
  deviceId: string;
  queryId: string;
  body: {
    response: string;
  };
}

export async function fetchLatestResults(
  lobbyData: Lobby | undefined
): Promise<PushResponse[] | []> {
  try {
    const response = await api.get("/control-id/results");
    const data: PushResponse[] = response.data;
    if (lobbyData && data.length > 0) {
      const filteredData = data.filter((item) =>
        lobbyData.device.some((device) => device.name === item.deviceId)
      );
      const latest = filteredData.slice(-lobbyData.device.length);
      return latest;
    }

    return [];
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
}
