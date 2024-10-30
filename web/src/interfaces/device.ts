interface Device {
  deviceId: number;
  name: string;
  ip: string;
  ramal: number;
  description: string;
  deviceModelId: number;
  lobbyId: number;
  login: string;
  status: string;
  password: string;
  deviceModel: {
    model: string;
  };
  lobby: {
    name: string;
  };
}
