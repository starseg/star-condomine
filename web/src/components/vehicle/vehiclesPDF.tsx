import { Button } from "@/components/ui/button";
import { simpleDateFormat } from "@/lib/utils";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const VehiclesPDF = ({ data }: { data: Vehicle[] }) => {
  const generatePdf = (data: Vehicle[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const currentDate = new Date();
    const date = simpleDateFormat(currentDate.toString());

    doc.text(
      `Veículos dos proprietários da portaria ${data[0].lobby.name} - STAR SEG`,
      15,
      10
    );
    doc.text(`Data: ${date}`, 15, 20);

    const headers = [
      "Tipo",
      "Placa",
      "Tag",
      "Marca - Modelo - Cor",
      "Proprietário",
      "Observações",
    ];

    const tableData = data.map((row) => [
      row.vehicleType.description,
      row.licensePlate,
      row.tag,
      row.brand + " " + row.model + " " + row.color,
      row.member.name,
      row.comments ? row.comments : "Nenhuma",
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

    doc.save(`Relatório_de_Veículos_${data[0].lobby.name}.pdf`);
  };

  return (
    <Button className="flex gap-2 text-xl" onClick={() => generatePdf(data)}>
      {" "}
      <FilePdf size={24} /> Gerar arquivo
    </Button>
  );
};
