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
export function LogsByOperatorChart(data: LogsByOperatorChartProps[]) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    const operatorName = data[i].operator.split(" ");
    const operator =
      operatorName.length > 1
        ? operatorName[0]
          .concat(" ")
          .concat(operatorName[operatorName.length - 1])
        : operatorName[0];
    const count = data[i].count;
    chartData.push({ operador: operator, logs: count });
  }

  const options = {
    logs: {
      label: "Atividades",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Atividades por monitor(a)</CardTitle>
        <CardDescription>
          Quantidade de atividades por operador nos últimos 30 dias
        </CardDescription>
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
              dataKey="operador"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4) + "..."}
              padding={{ bottom: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="logs" type="number" />
            <Bar dataKey="logs" fill="#db2777" radius={5}>
              <LabelList
                dataKey="logs"
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
