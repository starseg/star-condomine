'use-client'

import { simpleDateFormat } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable, { Styles } from "jspdf-autotable";
import { Button } from "../ui/button";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

function generateEmployeePDF(data: Member[], lobby: string) {
  const doc = new jsPDF({ orientation: "landscape" });
  const currentDate = new Date();
  const date = simpleDateFormat(currentDate.toString());

  doc.text(`Lista de funcionários - ${lobby}`, 15, 10);
  doc.text(`Data: ${date}`, 15, 20);

  const headers = [
    "Nome",
    "CPF",
    "RG",
    "Cargo",
    "Período de acesso",
    "Observações",
    "Formas de acesso",
    "Data de registro",
    "Última atualização",
  ];

  const tableData = data.map((row) => {
    const accessMethods = [
      row.faceAccess === 'true' ? "Facial" : "",
      row.biometricAccess === 'true' ? "Biometria" : "",
      row.remoteControlAccess === 'true' ? "Controle remoto" : "",
      row.passwordAccess === 'true' ? "Senha" : "",
    ].filter(Boolean).join(", ");

    return [
      row.name,
      row.cpf,
      row.rg,
      row.position,
      row.accessPeriod,
      row.comments || "",
      accessMethods,
      simpleDateFormat(row.createdAt.toString()),
      simpleDateFormat(row.updatedAt.toString()),
    ];
  });

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
        value = (value as { description: string }).description; // Converte objeto para string
      }
      obj[header] = (value as string | undefined) ?? ""; // Assegura que o valor não seja undefined
    });
    return obj;
  });

  doc.setFontSize(12);

  const columnWidths = headers.map((header) => {
    if (header === "Observações") {
      return 50;
    }

    if (header === "Período de acesso") {
      return 45;
    }

    if (header === "Nome") {
      return 30;
    }

    return 'auto';
  })

  autoTable(doc, {
    body: tableRows,
    headStyles: { fillColor: '#eab308' },
    columns: headers.map((header, index) => ({
      header,
      dataKey: header,
      width: columnWidths[index],
    })),
    margin: { top: 10 },
    startY: 25,
    theme: "grid", // Pode ajustar conforme preferir
    columnStyles: headers.reduce((styles, header) => {
      styles[header] = { cellWidth: columnWidths[headers.indexOf(header)] };
      return styles;
    }, {} as { [key: string]: Partial<Styles> })
  });

  doc.save(`Lista de funcionários - ${lobby}.pdf`);
}

function generateResidentPDF(data: Member[], lobby: string) {
  const doc = new jsPDF({ orientation: "landscape" });
  const currentDate = new Date();
  const date = simpleDateFormat(currentDate.toString());

  doc.text(`Lista de moradores - ${lobby}`, 15, 10);
  doc.text(`Data: ${date}`, 15, 20);

  const headers = [
    "Nome",
    "CPF",
    "RG",
    "E-mail",
    "Telefone",
    "Endereço",
    "Observações",
    "Formas de acesso",
    "Data de registro",
    "Última atualização",
  ];

  const tableData = data.map((row) => {
    const accessMethods = [
      row.faceAccess ? "Facial" : "",
      row.biometricAccess ? "Biometria" : "",
      row.remoteControlAccess ? "Controle remoto" : "",
      row.passwordAccess ? "Senha" : "",
    ].filter(Boolean).join(", ");

    return [
      row.name,
      row.cpf,
      row.rg,
      row.email,
      row.telephone,
      row.address && row.addressType.description + " " + row.address,
      row.comments || "",
      accessMethods,
      simpleDateFormat(row.createdAt.toString()),
      simpleDateFormat(row.updatedAt.toString()),
    ];
  });

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
        value = (value as { description: string }).description; // Converte objeto para string
      }
      obj[header] = (value as string | undefined) ?? ""; // Assegura que o valor não seja undefined
    });
    return obj;
  });

  doc.setFontSize(12);

  const columnWidths = headers.map((header) => {
    if (header === "Observações") {
      return 60;
    }

    if (header === "Formas de acesso") {
      return 40;
    }
    return 22;
  })

  autoTable(doc, {
    body: tableRows,
    headStyles: { fillColor: '#eab308' },
    columns: headers.map((header, index) => ({
      header,
      dataKey: header,
      width: columnWidths[index],
    })),
    margin: { top: 10 },
    startY: 25,
    theme: "grid", // Pode ajustar conforme preferir
    columnStyles: headers.reduce((styles, header) => {
      styles[header] = { cellWidth: columnWidths[headers.indexOf(header)] };
      return styles;
    }, {} as { [key: string]: Partial<Styles> })
  });

  doc.save(`Lista de moradores - ${lobby}.pdf`);
}

export const MemberPDF = ({ data, lobbyId }: { data: Member[], lobbyId: Number }) => {

  const [lobbyData, setLobbyData] = useState<Lobby | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`lobby/find/${lobbyId}`);
      setLobbyData(response.data);
    };

    fetchData();
  }, []);

  if (!lobbyData) {
    return;
  }

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        if (data[0].type === "EMPLOYEE") {
          generateEmployeePDF(data, lobbyData.name || "Desconhecido");
        } else {
          generateResidentPDF(data, lobbyData.name || "Desconhecido");
        }
      }}
    >
      {" "}
      <FilePdf size={24} /> Exportar para PDF
    </Button>
  );
}