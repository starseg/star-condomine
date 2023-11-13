import express from "express";
import cors from "cors";

import {
  createOperator,
  getAllOperators,
  getOperator,
  updateOperator,
  deleteOperator
} from "./controllers/operator";

import {
  createMember,
  deleteMember,
  getAllMembers,
  getMember,
  updateMember,
} from "./controllers/member";

import {
  createLobby,
  deleteLobby,
  getAllLobbies,
  getLobby,
  updateLobby,
} from "./controllers/lobby";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});

// === MANIPULAÇÃO DE OPERADORES (OPERATORS) === \\
app.get("/operator", getAllOperators);
app.get("/operators/:id", getOperator);
app.post("/operators", createOperator);
app.put("/operators/:id", updateOperator);
app.delete("/operators/:id", deleteOperator);

// === MANIPULAÇÃO DE MEMBROS (MEMBERS) === \\
app.get("/members", getAllMembers);
app.get("/members/:id", getMember);
app.post("/members", createMember);
app.put("/members/:id", updateMember);
app.delete("/members/:id", deleteMember);

// === MANIPULAÇÃO DE PORTARIAS (LOBBIES) === \\
app.get("/lobbies", getAllLobbies);
app.get("/lobbies/:id", getLobby);
app.post("/lobbies", createLobby);
app.put("/lobbies/:id", updateLobby);
app.delete("/lobbies/:id", deleteLobby);


const port = 3000;
app.listen(port, () => {
  console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
