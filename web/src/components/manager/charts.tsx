import { Chart } from "react-google-charts";

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
  chartData.push(["Portaria", "Acessos"]);
  for (let i = 0; i < Object.keys(data).length; i++) {
    const lobby = data[i].lobby;
    const count = data[i].count;
    chartData.push([lobby, count]);
  }

  const options = {
    title: "Acessos por portaria",
    backgroundColor: "#0c0a09",
    colors: ["#FFA500"],
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
      height={"600px"}
      width={"800px"}
    />
  );
}
