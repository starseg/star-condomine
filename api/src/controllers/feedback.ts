import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFeedbacks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os feedbacks" });
  }
};

export const getFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const feedback = await prisma.feedback.findUniqueOrThrow({
      where: { feedbackId: id },
    });
    if (!feedback) {
      res.status(404).json({ error: "feedback não encontrado" });
      return;
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o feedback" });
  }
};

export const createFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, subject, message } = req.body;
    const Feedback = await prisma.feedback.create({
      data: { name, subject, message },
    });
    res.status(201).json(Feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o feedback" });
  }
};

export const updateFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, subject, message, response, status } = req.body;
    const feedback = await prisma.feedback.update({
      where: { feedbackId: id },
      data: { name, subject, message, response, status },
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o feedback" });
  }
};

export const deleteFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.feedback.delete({
      where: { feedbackId: id },
    });
    res.json({ message: "feedback excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o feedback" });
  }
};
