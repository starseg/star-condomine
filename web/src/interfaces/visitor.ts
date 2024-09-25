interface Visitor {
  visitorId: number;
  profileUrl: string;
  documentUrl: string | null;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  relation: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
  scheduling: [
    {
      schedulingId: number;
    }
  ];
  access: [];
  lobby: {
    exitControl: "ACTIVE" | "INACTIVE";
  };
}

interface VisitorFull {
  visitorId: number;
  profileUrl: string;
  documentUrl: string | null;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  relation: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
  scheduling: [
    {
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
    }
  ];
  access: [
    {
      accessId: number;
      startTime: string;
      endTime: string;
      local: string;
      reason: string;
      comments: string;
      createdAt: string;
      updatedAt: string;
      status: "ACTIVE" | "INACTIVE" | undefined;
      memberId: number;
      lobbyId: number;
      member: {
        name: string;
      };
    }
  ];
  lobby: {
    exitControl: "ACTIVE" | "INACTIVE";
  };
  visitorGroup: [
    {
      group: {
        name: string;
      };
    }
  ];
}
