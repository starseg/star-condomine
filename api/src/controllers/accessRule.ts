import { Request, Response } from "express";
import prisma from "../db";

export const getAllAccessRules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accessRule = await prisma.accessRule.findMany({
      orderBy: [{ accessRuleId: "asc" }],
    });
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as regras de acesso" });
  }
};

export const getAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const accessRule = await prisma.accessRule.findUniqueOrThrow({
      where: { accessRuleId: id },
    });
    if (!accessRule) {
      res.status(404).json({ error: "regra de acesso não encontrada" });
      return;
    }
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a regra de acesso" });
  }
};

export const getAccessRulesByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const accessRule = await prisma.accessRule.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ accessRuleId: "asc" }],
    });
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar regras de acesso" });
  }
};

export const createAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, type, priority, lobbyId } = req.body;
    const accessRule = await prisma.accessRule.create({
      data: { name, type, priority, lobbyId },
    });
    res.status(201).json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a regra de acesso" });
  }
};

export const updateAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, type, priority, lobbyId } = req.body;
    const accessRule = await prisma.accessRule.update({
      where: { accessRuleId: id },
      data: { name, type, priority, lobbyId },
    });
    res.status(200).json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a regra de acesso" });
  }
};

export const deleteAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.accessRule.delete({
      where: { accessRuleId: id },
    });
    res.json({ message: "regra de acesso excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a regra de acesso" });
  }
};
