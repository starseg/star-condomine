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
export function AccessesByOperatorChart(data: AccessByOperatorChartProps[]) {
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
    chartData.push({ operador: operator, acessos: count });
  }

  const options = {
    acessos: {
      label: "Acessos",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Atendimentos por monitor(a)</CardTitle>
        <CardDescription>Quantidade de acessos por operador</CardDescription>
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
              tickMargin={-20}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="acessos" type="number" padding={{ left: 30 }} />
            <Bar dataKey="acessos" fill="#db2777" radius={5}>
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
