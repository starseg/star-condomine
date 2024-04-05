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
