import {
  createLogging
} from "./chunk-75DSBTFO.mjs";

// src/middlewares/logging.ts
var logging = async (req, res, next) => {
  try {
    const { method, url, headers, operator } = req;
    const userAgent = headers["user-agent"] || "Desconhecido";
    const operatorId = operator.user.id;
    if (method !== "GET" && !url.startsWith("/log"))
      await createLogging(method, url, userAgent, operatorId);
    next();
  } catch (error) {
    console.error("Erro ao criar o registro de logging:", error);
    res.status(500).json({ error: "Erro ao criar o registro" });
  }
};

export {
  logging
};
