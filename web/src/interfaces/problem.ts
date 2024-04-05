interface Problem {
  lobbyProblemId: number;
  title: string;
  description: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  operatorId: number;
  operator: {
    operatorId: number;
    name: string;
  };
}
