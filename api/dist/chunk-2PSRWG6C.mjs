import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/feedback.ts
var getAllFeedbacks = async (req, res) => {
  try {
    const feedback = await db_default.feedback.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "asc" }]
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os feedbacks" });
  }
};
var getFeedback = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const feedback = await db_default.feedback.findUniqueOrThrow({
      where: { feedbackId: id }
    });
    if (!feedback) {
      res.status(404).json({ error: "feedback n\xE3o encontrado" });
      return;
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o feedback" });
  }
};
var createFeedback = async (req, res) => {
  try {
    const { name, subject, message } = req.body;
    const Feedback = await db_default.feedback.create({
      data: { name, subject, message }
    });
    res.status(201).json(Feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o feedback" });
  }
};
var updateFeedback = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, subject, message, response, status } = req.body;
    const feedback = await db_default.feedback.update({
      where: { feedbackId: id },
      data: { name, subject, message, response, status }
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o feedback" });
  }
};
var deleteFeedback = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.feedback.delete({
      where: { feedbackId: id }
    });
    res.json({ message: "feedback exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o feedback" });
  }
};
var countNewFeedbacks = async (req, res) => {
  try {
    const feedback = await db_default.feedback.count({
      where: { status: "ACTIVE" }
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os feedbacks" });
  }
};

export {
  getAllFeedbacks,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  countNewFeedbacks
};
