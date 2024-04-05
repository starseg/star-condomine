interface Device {
  deviceId: number;
  name: string;
  ip: string;
  ramal: number;
  description: string;
  deviceModelId: number;
  lobbyId: number;
  deviceModel: {
    model: string;
  };
}
