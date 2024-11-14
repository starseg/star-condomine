import html2pdf from "html2pdf.js";

export const generatePDF = () => {
  const dashboardElement = document.getElementById("dashboard");
  if (!dashboardElement) return;

  const opt = {
    margin: 0.5,
    filename: "dashboard.pdf",
    image: { type: "png", quality: 0.7 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
  };

  html2pdf().set(opt).from(dashboardElement).save();
};
