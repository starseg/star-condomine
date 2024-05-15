interface Lobby {
  lobbyId: number;
  cnpj: string;
  name: string;
  responsible: string;
  telephone: string;
  schedules: string;
  procedures: string;
  datasheet: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  code: number;
  type: "CONDOMINIUM" | "COMPANY" | undefined;
  exitControl: "ACTIVE" | "INACTIVE" | undefined;
  createdAt: string;
  updatedAt: string;
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
