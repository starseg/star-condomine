interface Member {
  memberId: number;
  type: string;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  comments: string;
  status: string;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressTypeId: number;
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: string;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
}

interface MemberFull {
  memberId: number;
  type: string;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  comments: string;
  status: string;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressTypeId: number;
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: string;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
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
      visitor: {
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
      visitor: {
        name: string;
      };
    }
  ];
}

interface Tags {
  tagId: number;
  value: string;
  comments: string | null;
  status: "ACTIVE" | "INACTIVE";
  tagTypeId: number;
  type: {
    description: string;
  };
  memberId: number;
  member: {
    name: string;
  };
}
