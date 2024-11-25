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
export function AccessesPerHourChart(data: AccessPerHourChartProps) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data.hourlyCounts).length; i++) {
    const hour = data.hourlyCounts[i].hour.toString().concat("h");
    const count = data.hourlyCounts[i].count;
    chartData.push({ hora: hour, acessos: count });
  }

  const options = {
    acessos: {
      label: "Acessos",
    },
  } satisfies ChartConfig;

  const maxValue = Math.max(...chartData.map((item: any) => item.acessos));

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Acessos por hora</CardTitle>
        <CardDescription>Quantidade de acessos por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={options} className="max-w-[800px] min-h-[600px]">
          <BarChart
            data={chartData}
            accessibilityLayer
            layout="vertical"
            margin={{ left: 5 }}
          >
            <YAxis
              dataKey="hora"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              padding={{ bottom: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="acessos" type="number" domain={[0, Math.floor(maxValue * 2.5 / 2)]} />
            <Bar dataKey="acessos" fill="#60a5fa" radius={5}>
              <LabelList
                dataKey="acessos"
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
