interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  tag: string;
  comments: string;
  vehicleType: {
    vehicleTypeId: number;
    description: string;
  };
  member: {
    memberId: number;
    name: string;
  };
  lobbyId: number;
  lobby: {
    name: string;
  };
}
