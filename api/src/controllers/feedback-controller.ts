import { z, ZodError } from "zod";
import { FeedbackService } from "../services/feedback-service";
import { Request, Response } from "express";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";

const feedbackSchema = z.object({
  name: z.string(),
  subject: z.string(),
  message: z.string(),
  response: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

const feedbackService = new FeedbackService()

export async function getAllFeedbacks(req: Request, res: Response) {
  try {
    const feedback = await feedbackService.getAllFeedbacks();
    return res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os feedbacks", error });
  }
}

export async function getFeedback(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const feedback = await feedbackService.getFeedback(id);
    return res.json(feedback);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ message: "Erro ao buscar o feedback", error });
  }
}

export async function createFeedback(req: Request, res: Response) {
  try {
    const { name, subject, message } = feedbackSchema.parse(req.body);
    const feedback = await feedbackService.createFeedback({ name, subject, message });
    res.status(201).json(feedback);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ message: "Erro ao criar o feedback", error });
  }
}

export async function updateFeedback(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const { name, subject, message, response, status } = feedbackSchema.partial().parse(req.body);
    const feedback = await feedbackService.updateFeedback(id, { name, subject, message, response, status });
    return res.status(200).json(feedback);
  } catch (error) {

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ message: "Erro ao atualizar o feedback", error });
  }
}

export async function deleteFeedback(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const feedback = await feedbackService.deleteFeedback(id);
    return res.json(feedback);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ message: "Erro ao deletar o feedback", error });
  }
}

export async function countNewFeedbacks(req: Request, res: Response) {
  try {
    const feedbackCount = await feedbackService.countNewFeedbacks();
    return res.json(feedbackCount);
  } catch (error) {
    res.status(500).json({ message: "Erro ao contar os feedbacks", error });
  }
}