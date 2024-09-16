import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/notification.ts
var getAllNotifications = async (req, res) => {
  const currentDate = /* @__PURE__ */ new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  try {
    const notification = await db_default.notification.findMany({
      orderBy: [{ notificationId: "desc" }]
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as notifica\xE7\xF5es" });
  }
};
var getActiveNotifications = async (req, res) => {
  const currentDate = /* @__PURE__ */ new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  try {
    const notification = await db_default.notification.findMany({
      where: {
        date: {
          lte: currentDate,
          gte: sevenDaysAgo
        },
        status: "ACTIVE"
      },
      orderBy: [{ notificationId: "desc" }]
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as notifica\xE7\xF5es" });
  }
};
var getNotification = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const notification = await db_default.notification.findUniqueOrThrow({
      where: { notificationId: id }
    });
    if (!notification) {
      res.status(404).json({ error: "notifica\xE7\xE3o n\xE3o encontrada" });
      return;
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a notifica\xE7\xE3o" });
  }
};
var createNotification = async (req, res) => {
  try {
    const { title, message, date } = req.body;
    const notification = await db_default.notification.create({
      data: { title, message, date }
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a notifica\xE7\xE3o" });
  }
};
var updateNotification = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, message, date, status } = req.body;
    const notification = await db_default.notification.update({
      where: { notificationId: id },
      data: { title, message, date, status }
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a notifica\xE7\xE3o" });
  }
};
var deleteNotification = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.notification.delete({
      where: { notificationId: id }
    });
    res.json({ message: "notifica\xE7\xE3o exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a notifica\xE7\xE3o" });
  }
};

export {
  getAllNotifications,
  getActiveNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification
};
