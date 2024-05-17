import { Request, Response } from "express";
import prisma from "../db";

export const getAllTags = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tag = await prisma.tag.findMany();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};

export const getTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const tag = await prisma.tag.findUniqueOrThrow({
      where: { tagId: id },
    });
    if (!tag) {
      res.status(404).json({ error: "Tag não encontrada" });
      return;
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a tag" });
  }
};

export const getTagsByMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const tags = await prisma.tag.findMany({
      where: { memberId: id },
      include: {
        type: { select: { description: true } },
        member: { select: { name: true } },
      },
      orderBy: [{ status: "asc" }],
    });
    if (!tags) {
      res.status(404).json({ error: "Tags não encontradas" });
      return;
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value, comments, tagTypeId, memberId } = req.body;
    const tag = await prisma.tag.create({
      data: { value, comments, tagTypeId, memberId },
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a tag" });
  }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { value, tagTypeId, comments, status, memberId } = req.body;
    const tag = await prisma.tag.update({
      where: { tagId: id },
      data: { value, tagTypeId, comments, status, memberId },
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a tag" });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.tag.delete({
      where: { tagId: id },
    });
    res.json({ message: "Tag excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a tag" });
  }
};

export const getTagTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tag = await prisma.tagType.findMany();
    if (!tag) {
      res.status(404).json({ error: "Tipos não encontrados" });
      return;
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos" });
  }
};

export const deleteTagsByMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.tag.deleteMany({
      where: { memberId: id },
    });
    res.json({ message: "Tags excluídas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir as tags" });
  }
};

export const getTagsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const tags = await prisma.tag.findMany({
      include: {
        type: { select: { description: true } },
        member: { select: { rg: true, cpf: true, name: true } },
      },
      where: {
        member: {
          lobbyId: id,
        },
      },
      orderBy: [{ status: "asc" }, { member: { name: "asc" } }],
    });
    if (!tags) {
      res.status(404).json({ error: "Tags não encontradas" });
      return;
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};
