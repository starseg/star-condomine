import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "StarCondomine",
    description: "Api para a Plataforma Star Condomine",
  },
  host: "starcondomineapi.starseg.com",
};

export const outputFile = "./swagger-output.json";
const routes = ["./app.ts"];

swaggerAutogen(outputFile, routes, doc);
