import express from "express";
import cors from "cors";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./controllers/user";

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

const port = 3000;

app.get("/", (request, response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});

// MANIPULAÇÃO DE USUÁRIOS (USERS)
app.get("/users", getAllUsers);
app.get("/users/:id", getUser);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// MANIPULAÇÃO DE PORTARIAS (LOBBIES)
app.get("/lobbies", getAllLobbies);
app.get("/lobbies/:id", getLobby);
app.post("/lobbies", createLobby);
app.put("/lobbies/:id", updateLobby);
app.delete("/lobbies/:id", deleteLobby);

app.listen(port, () => {
  console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
