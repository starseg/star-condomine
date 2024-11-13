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
import { DatePickerWithRange } from "@/components/report/calendarRange";
export function AccessesByLobbyChart(data: AccessByLobbyChartProps[]) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    chartData.push({ portaria: lobby, acessos: count });
  }

  const options = {
    acessos: {
      label: "Acessos",
      color: "#FFA500",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Acessos por portaria</CardTitle>
            <CardDescription>Quantidade de acessos por portaria</CardDescription>
          </div>
          <DatePickerWithRange />
        </div>
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
              dataKey="portaria"
              type="category"
              tickLine={false}
              tickMargin={-10}
              padding={{ bottom: 20 }}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5) + "..."}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent includeHidden />}
            />
            <XAxis dataKey="acessos" type="number" padding={{ left: 30 }} />
            <Bar dataKey="acessos" fill="#FFA500" radius={5}>
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
