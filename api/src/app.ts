import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/", (request, response) => {
  response.json({ message: "Minha primeira API com Node.js e Express" });
});

// MANIPULAÇÃO DE USUÁRIOS

app.get("/users", async (request, response) => {
  const users = await prisma.user.findMany();
  return response.json(users);
});

app.get("/users/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const users = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  return response.json(users);
});

app.post("/users/new", async (request, response) => {
  const body: any = request.body;
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });
  return response.sendStatus(201);
});

app.delete("/users/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const users = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return response.json(users);
});

app.put("/users/:id", async (request, response) => {
  const body: any = request.body;
  const id = parseInt(request.params.id);
  const users = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: body.name,
      email: body.email,
    }
  });
  return response.json(users);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
