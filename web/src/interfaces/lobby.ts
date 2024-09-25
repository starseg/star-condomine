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
  controllerBrandId: number;
  createdAt: string;
  updatedAt: string;
  device: [
    {
      deviceId: number;
      name: string;
      description: string;
      ip: string;
      ramal: number;
    }
  ];
  lobbyProblem: [
    {
      lobbyProblemId: number;
      status: string;
    }
  ];
  ControllerBrand: {
    controllerBrandId: number;
    name: string;
    iconUrl: string;
  };
}
