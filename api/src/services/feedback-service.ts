import { Prisma } from "@prisma/client";
import prisma from "../db";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";


export class FeedbackService {
  async getAllFeedbacks() {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    })

    return feedbacks;
  }

  async getFeedback(id: number) {
    const feedback = await prisma.feedback.findUnique({
      where: { feedbackId: id },
    })

    if (!feedback) {
      throw new ResourceNotFoundError();
    }

    return feedback;
  }

  async countNewFeedbacks() {
    const feedbackCount = await prisma.feedback.count({
      where: { status: "ACTIVE" },
    });

    return feedbackCount;
  }

  async createFeedback(feedback: Prisma.FeedbackUncheckedCreateInput) {
    const newFeedback = await prisma.feedback.create({
      data: feedback,
    });

    return newFeedback;
  }

  async updateFeedback(id: number, data: Prisma.FeedbackUpdateInput) {
    try {
      const updatedFeedback = await prisma.feedback.update({
        where: { feedbackId: id },
        data,
      });

      return updatedFeedback;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }

  async deleteFeedback(id: number) {
    try {
      const feedback = await prisma.feedback.delete({
        where: { feedbackId: id },
      });

      return feedback
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }
}