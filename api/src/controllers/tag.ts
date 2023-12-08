import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTags = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tag = await prisma.tag.findMany();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os telefones" });
  }
};

export const getTag = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const createTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { value, tagTypeId, memberId } = req.body;
    const tag = await prisma.tag.create({
      data: { value, tagTypeId, memberId },
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a tag" });
  }
};

export const deleteTag = async (
  req: Request,
  res: Response
): Promise<void> => {
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