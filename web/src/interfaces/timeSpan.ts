interface TimeSpan {
  timeSpanId: number;
  timeZoneId: number;
  start: number;
  end: number;
  sun: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  hol1: number;
  hol2: number;
  hol3: number;
  timeZone: {
    timeZoneId: number;
    name: string;
  };
}
