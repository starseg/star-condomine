import { Request, Response } from "express";
import prisma from "../db";

export const getAllTimeSpans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const timeSpan = await prisma.timeSpan.findMany({
      orderBy: [{ timeSpanId: "asc" }],
      include: { timeZone: true },
    });
    res.json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeSpans" });
  }
};

export const getTimeSpan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const timeSpan = await prisma.timeSpan.findUniqueOrThrow({
      where: { timeSpanId: id },
      include: { timeZone: true },
    });
    if (!timeSpan) {
      res.status(404).json({ error: "TimeSpan não encontrado" });
      return;
    }
    res.json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o TimeSpan" });
  }
};

export const createTimeSpan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      start,
      end,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      hol1,
      hol2,
      hol3,
      timeZoneId,
    } = req.body;
    const timeSpan = await prisma.timeSpan.create({
      data: {
        start,
        end,
        sun,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        hol1,
        hol2,
        hol3,
        timeZoneId,
      },
    });
    res.status(201).json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o TimeSpan" });
  }
};

export const updateTimeSpan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      start,
      end,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      hol1,
      hol2,
      hol3,
      timeZoneId,
    } = req.body;
    const timeSpan = await prisma.timeSpan.update({
      where: { timeSpanId: id },
      data: {
        start,
        end,
        sun,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        hol1,
        hol2,
        hol3,
        timeZoneId,
      },
    });
    res.status(200).json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o timeSpan" });
  }
};

export const deleteTimeSpan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.timeSpan.delete({
      where: { timeSpanId: id },
    });
    res.json({ message: "timeSpan excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o timeSpan" });
  }
};
