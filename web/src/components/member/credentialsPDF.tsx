import { Button } from "@/components/ui/button";
import { simpleDateFormat } from "@/lib/utils";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const CredentialsPDF = ({ data }: { data: Tags[] }) => {
  const generatePdf = (data: Tags[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const currentDate = new Date();
    const date = simpleDateFormat(currentDate.toString());

    doc.text(
      `Credenciais dos proprietários da portaria ${data[0].member.lobby.name} - STAR SEG`,
      15,
      10
    );
    doc.text(`Data: ${date}`, 15, 20);

    const headers = [
      "Proprietário",
      data[0].member.address && "Endereço",
      "Tipo",
      "Valor",
      "Observações",
      "Status",
    ].filter(Boolean);

    const tableData = data.map((row) =>
      [
        row.member.cpf + "\n" + row.member.name,
        data[0].member.address &&
          row.member.addressType.description + " " + row.member.address,
        row.type,
        row.value,
        row.comments ? row.comments : "Nenhuma",
        row.status === "ACTIVE" ? "Ativo" : "Inativo",
      ].filter(Boolean)
    );

    // Transforme os dados em objetos
    const tableRows = tableData.map((row) => {
      const obj: { [key: string]: string } = {}; // Ajuste o tipo para string
      headers.forEach((header, index) => {
        let value = row[index];
        if (
          typeof value === "object" &&
          value !== null &&
          "description" in value
        ) {
          value = value.description; // Converte objeto para string
        }
        obj[header] = (value as string | undefined) ?? ""; // Assegura que o valor não seja undefined
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

    doc.save(`Relatório_de_credenciais_${data[0].member.lobby.name}.pdf`);
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
