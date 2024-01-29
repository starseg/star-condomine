import { Button } from "@/components/ui/button";
import { formatDate, simpleDateFormat } from "@/lib/utils";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Access {
  accessId: number;
  startTime: string;
  endTime: string;
  local: string;
  reason: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  memberId: number;
  member: {
    name: string;
  };
  visitorId: number;
  visitor: {
    name: string;
  };
  operatorId: number;
  operator: {
    name: string;
  };
  lobbyId: number;
  lobby: {
    name: string;
  };
}

interface Period {
  from: string;
  to: string;
}

export const PdfButton = ({
  data,
  period,
}: {
  data: Access[];
  period: Period;
}) => {
  const generatePdf = (data: Access[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const from = period.from ? simpleDateFormat(period.from) : "";
    const to = period.to ? simpleDateFormat(period.to) : "";

    doc.text(`Relatório da portaria ${data[0].lobby.name} - Starseg`, 15, 10);
    doc.text(`Período: ${from} a ${to}`, 15, 20);

    const headers = [
      "Visitante",
      "Visitado",
      "Entrada",
      "Saída",
      "Motivo",
      "Local",
    ];

    const tableData = data.map((row) => [
      row.visitor.name,
      row.member.name,
      formatDate(row.startTime),
      row.endTime !== null ? formatDate(row.endTime) : "Não saiu",
      row.reason,
      row.local,
    ]);

    // Transforme os dados em objetos
    const tableRows = tableData.map((row) => {
      const obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    doc.setFontSize(12);

    const columnWidths = [40, 40, 30, 30, 40, 30];
    autoTable(doc, {
      body: tableRows,
      columns: headers.map((header, index) => ({
        header,
        dataKey: header,
        width: columnWidths[index],
      })),
      margin: { top: 25 },
      startY: 25,
      theme: "striped", // Pode ajustar conforme preferir
    });

    // Insira a tabela no documento PDF
    // doc.table(10, 30, tableRows, headers, { autoSize: true });

    doc.save(`Relatório_da_portaria_${data[0].lobby.name}.pdf`);
  };

  return (
    <Button
      variant={"outline"}
      className="flex gap-2 px-8 mt-4"
      onClick={() => generatePdf(data)}
    >
      {" "}
      <FilePdf size={24} /> Gerar arquivo
    </Button>
  );
};
