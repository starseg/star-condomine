import { Chart } from "react-google-charts";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function ProblemChart(props: ProblemChartProps) {
  const data = [
    ["Problemas", "Quantidade"],
    ["Resolvidos", props.solved],
    ["Não resolvidos", props.total - props.solved],
  ];

  const options = {
    title: "Problemas nas portarias",
    is3D: true,
    backgroundColor: "#0c0a09",
    titleTextStyle: {
      color: "white",
      fontSize: 18,
    },
    legend: {
      textStyle: {
        color: "white",
      },
    },
    slices: {
      0: { color: "#15803d" },
      1: { color: "#ef4444" },
    },
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      height={"200px"}
      width={"400px"}
    />
  );
}

export function ProblemByLobbyChart(data: AccessByLobbyChartProps[]) {
  const chartData: any = [];
  chartData.push(["Problemas", "Quantidade"]);
  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    chartData.push([lobby, count]);
  }

  const options = {
    title: "Problemas por portaria",
    // is3D: true,
    pieHole: 0.3,
    backgroundColor: "#0c0a09",
    titleTextStyle: {
      color: "white",
      fontSize: 18,
    },
    legend: {
      textStyle: {
        color: "white",
      },
    },
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={options}
      height={"200px"}
      width={"400px"}
    />
  );
}

export function AccessesByLobbyChart(data: AccessByLobbyChartProps[]) {
  const chartData: any = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    chartData.push({ portaria: lobby, acessos: count });
  }

  // for (let i = 0; i < 20; i++) {
  //   chartData.push({ portaria: `Portaria ${i}`, acessos: Math.floor(Math.random() * 5000) })
  // }



  console.log(chartData)

  const options = {
    acessos: {
      label: "Acessos",
      color: "#FFA500"
    }
  } satisfies ChartConfig;

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Acessos por portaria</CardTitle>
        <CardDescription>Quantidade de acessos por portaria</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={options} className="min-w-[800px]">
          <BarChart data={chartData} accessibilityLayer layout="vertical" margin={{ left: 5 }}>
            <YAxis
              dataKey="portaria"
              type="category"
              tickLine={false}
              tickMargin={-5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8) + "..."}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent includeHidden />} />
            <XAxis dataKey="acessos" type="number" padding={{ left: 10 }} />
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
    </Card >

  );
}

export function AccessesByOperatorChart(data: AccessByOperatorChartProps[]) {
  const chartData: any = [];
  chartData.push(["Monitor(a)", "Registros de acesso"]);
  for (let i = 0; i < Object.keys(data).length; i++) {
    const operatorName = data[i].operator.split(" ");
    const operator = operatorName[0]
      .concat(" ")
      .concat(operatorName[operatorName.length - 1]);
    const count = data[i].count;
    chartData.push([operator, count]);
  }

  const options = {
    title: "Atendimentos por monitor(a)",
    backgroundColor: "#0c0a09",
    colors: ["#eb3f5c"],
    titleTextStyle: {
      color: "white",
      fontSize: 18,
    },
    hAxis: {
      textStyle: {
        color: "white", // Cor do texto no eixo horizontal
      },
    },
    vAxis: {
      textStyle: {
        color: "white", // Cor do texto no eixo vertical
      },
    },
    legend: "none",
  };

  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={options}
      height={"950px"}
      width={"950px"}
    />
  );
}

export function AccessesPerHourChart(data: AccessPerHourChartProps) {
  const chartData: any = [];
  chartData.push(["Hora", "Acessos"]);
  for (let i = 0; i < Object.keys(data.hourlyCounts).length; i++) {
    const hour = data.hourlyCounts[i].hour.toString().concat("h");
    const count = data.hourlyCounts[i].count;
    chartData.push([hour, count]);
  }

  const options = {
    title: "Acessos por hora",
    backgroundColor: "#0c0a09",
    colors: ["#358de6"],
    titleTextStyle: {
      color: "white",
      fontSize: 18,
    },
    hAxis: {
      textStyle: {
        color: "white", // Cor do texto no eixo horizontal
      },
    },
    vAxis: {
      textStyle: {
        color: "white", // Cor do texto no eixo vertical
      },
    },
    legend: "none",
  };

  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={options}
      height={"950px"}
      width={"950px"}
    />
  );
}
