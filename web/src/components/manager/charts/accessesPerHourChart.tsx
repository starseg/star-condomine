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

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Acessos por hora</CardTitle>
        <CardDescription>Quantidade de acessos por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={options} className="min-w-[800px]">
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
              tickMargin={-20}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="acessos" type="number" padding={{ left: 30 }} />
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