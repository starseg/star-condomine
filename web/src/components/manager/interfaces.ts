interface ProblemChartProps {
  total: number;
  solved: number;
}

interface AccessByLobbyChartProps {
  lobby: string;
  count: number;
}

interface AccessByOperatorChartProps {
  operator: string;
  count: number;
}

interface AccessPerHourChartProps {
  averageAccessesPerHour: number;
  hourlyCounts: {
    hour: number;
    count: number;
  }[];
}

interface AccessByVisitorTypeChartProps {
  visitorType: string;
  count: number;
}

interface LogsByOperatorChartProps {
  operator: string;
  count: number;
}
