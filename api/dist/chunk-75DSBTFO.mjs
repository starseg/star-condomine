import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/logging.ts
var getAllLoggings = async (req, res) => {
  try {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - 7);
    const formattedDate = date.toISOString();
    const logging = await db_default.logging.findMany({
      where: {
        date: {
          gte: formattedDate
        }
      },
      include: {
        operator: {
          select: {
            name: true
          }
        }
      },
      orderBy: [{ date: "desc" }]
    });
    res.json(logging);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os registros" });
  }
};
var getLogging = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const logging = await db_default.logging.findUniqueOrThrow({
      where: { logId: id }
    });
    if (!logging) {
      res.status(404).json({ error: "Registro n\xE3o encontrado" });
      return;
    }
    res.json(logging);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o registro" });
  }
};
var createLogging = async (method, url, userAgent, operatorId) => {
  try {
    const logging = await db_default.logging.create({
      data: { method, url, userAgent, operatorId }
    });
  } catch (error) {
    console.error("Erro ao criar o registro de logging:", error);
    throw error;
  }
};
var deleteLogging = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.logging.delete({
      where: { logId: id }
    });
    res.json({ message: "Registro exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o registro" });
  }
};

export {
  getAllLoggings,
  getLogging,
  createLogging,
  deleteLogging
};
