import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
export function SchedulingsByLobbyChart(data: AccessByLobbyChartProps[]) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    chartData.push({ portaria: lobby, agendamentos: count });
  }

  const options = {
    agendamentos: {
      label: "Agendamentos",
      color: "#10b981",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Agendamentos por portaria</CardTitle>
        <CardDescription>
          Quantidade de agendamentos por portaria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={options} className="max-w-[800px] min-h-[600px]">
          <BarChart
            data={chartData}
            accessibilityLayer
            layout="vertical"
            margin={{ left: 5, top: 10 }}
          >
            <YAxis
              dataKey="portaria"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5) + "..."}
              padding={{ bottom: 15 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis
              dataKey="agendamentos"
              type="number"
              padding={{ left: 10 }}
            />
            <Bar dataKey="agendamentos" fill="#10b981" radius={5}>
              <LabelList
                dataKey="agendamentos"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
