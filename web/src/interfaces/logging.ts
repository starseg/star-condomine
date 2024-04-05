interface Log {
  logId: number;
  date: string;
  method: string;
  url: string;
  userAgent: string;
  operatorId: string;
  operator: {
    name: string;
  };
}
