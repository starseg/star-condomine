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
export function AccessesByVisitorTypeChart(
  data: AccessByVisitorTypeChartProps[]
) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    const visitorType = data[i].visitorType;
    const count = data[i].count;
    chartData.push({ tipo_visitante: visitorType, acessos: count });
  }

  const options = {
    acessos: {
      label: "Acessos",
      color: "#a855f7",
    },
  } satisfies ChartConfig;

  const maxValue = Math.max(...chartData.map((item: any) => item.acessos));

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Acessos por tipo de visitante</CardTitle>
        <CardDescription>
          Quantidade de acessos por tipo de visitante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={options} className="w-[800px] h-[200px]">
          <BarChart
            data={chartData}
            accessibilityLayer
            layout="vertical"
          >
            <YAxis
              dataKey="tipo_visitante"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6) + "..."}
              padding={{ bottom: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="acessos" type="number" domain={[0, Math.floor(maxValue * 2.5 / 2)]} />
            <Bar dataKey="acessos" fill="#a855f7" radius={5}>
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
