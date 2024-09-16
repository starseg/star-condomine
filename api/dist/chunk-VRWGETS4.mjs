// src/controllers/operator.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
var prisma = new PrismaClient();
var getAllOperators = async (req, res) => {
  try {
    const operator = await prisma.operator.findMany();
    res.json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os operadores" });
  }
};
var getOperator = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const operator = await prisma.operator.findUniqueOrThrow({
      where: { operatorId: id }
    });
    if (!operator) {
      res.status(404).json({ error: "Operador n\xE3o encontrado" });
      return;
    }
    res.json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o operador" });
  }
};
var createOperator = async (req, res) => {
  try {
    const { username, name, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const operator = await prisma.operator.create({
      data: { username, name, password: hashedPassword, type }
    });
    res.status(201).json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o operador" });
  }
};
var updateOperator = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, name, password, type, status } = req.body;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const operator = await prisma.operator.update({
      where: { operatorId: id },
      data: {
        username,
        name,
        password: hashedPassword || void 0,
        type,
        status
      }
    });
    res.status(200).json(operator);
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar o operador ${error}` });
  }
};
var deleteOperator = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.operator.delete({
      where: { operatorId: id }
    });
    res.json({ message: "Operador exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o operador" });
  }
};

export {
  getAllOperators,
  getOperator,
  createOperator,
  updateOperator,
  deleteOperator
};
