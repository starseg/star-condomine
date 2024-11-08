"use client";

import { TrendingUp } from "lucide-react";
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

export function ProblemChart({ total, solved }: ProblemChartProps) {
  const chartData = [
    { type: "solved", amount: solved, fill: "#15803d" },
    { type: "unsolved", amount: total - solved, fill: "#dc2626" },
  ];

  const solvedPercent = (solved / total) * 100;

  const chartConfig = {
    amount: {
      label: "Quantidade",
    },
    solved: {
      label: "Resolvidos",
      color: "hsl(var(--chart-1))",
    },
    unsolved: {
      label: "Ativos",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Problemas nas portarias</CardTitle>
        <CardDescription>Total resolvidos x ativos</CardDescription>
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
            <Pie data={chartData} dataKey="amount" nameKey="type" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {solvedPercent.toFixed(2)}% de problemas resolvidos
        </div>
      </CardFooter>
    </Card>
  );
}
