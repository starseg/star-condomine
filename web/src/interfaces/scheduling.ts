interface Scheduling {
  schedulingId: number;
  startDate: string;
  endDate: string;
  location: string;
  reason: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
}

interface SchedulingList {
  schedulingListId: number;
  description: string;
  url: string;
  status: string;
  createdAt: string;
  memberId: number;
  member: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
  lobbyId: number;
  lobby: {
    name: string;
  };
}
