interface Visitor {
  visitorId: number;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
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
}
