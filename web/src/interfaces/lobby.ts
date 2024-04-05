interface Lobby {
  lobbyId: number;
  name: String;
  state: String;
  city: String;
  schedules: String;
  device: [
    {
      deviceId: number;
      name: String;
      ip: String;
      ramal: number;
    }
  ];
  lobbyProblem: [
    {
      lobbyProblemId: String;
      status: String;
    }
  ];
}
