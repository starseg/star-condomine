"use client";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateHexColor } from "@/lib/utils";

export function ProblemsByLobbyChart(data: AccessByLobbyChartProps[]) {
  const chartData: any = [];
  let total = 0;

  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    total += count;
    chartData.push({ lobby: lobby, count: count, fill: generateHexColor() });
  }

  const chartConfig = {
    count: {
      label: "Quantidade",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Problemas por Portaria</CardTitle>
        <CardDescription>Total registrado em cada portaria</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="lobby"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Média de {(total / Object.keys(data).length).toFixed(2)} problemas por portaria
        </div>
      </CardFooter>
    </Card>
  );
}
