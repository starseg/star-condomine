import { z, ZodError } from "zod";
import { GeneralDataService } from "../services/general-data-service";
import { Request, Response } from "express";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";
import { InvalidDateError } from "../services/errors/invalid-date-error";

const generalDataService = new GeneralDataService();

export async function getCardsCountData(req: Request, res: Response) {
  try {
    const data = await generalDataService.getCardsCountData();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getAccessesByLobby(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getAccessesByLobby(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getProblemsByLobby(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getProblemsByLobby(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getAccessesByOperator(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getAccessesByOperator(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getAccessesByVisitorType(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getAccessesByVisitorType(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: error.message })
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getCountExitsPerHour(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getCountExitsPerHour(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: error.message })
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getCountAccessesPerHour(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getCountAccessesPerHour(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: error.message })
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getSchedulingByLobby(req: Request, res: Response) {
  try {
    const { startTime, endTime } = z.object({
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
    }).parse(req.query);

    const data = await generalDataService.getSchedulingByLobby(startTime, endTime);
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ message: error.message, type: "InvalidDateError" });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: error.message })
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}

export async function getLogsByOperator(req: Request, res: Response) {
  try {
    const data = await generalDataService.getLogsByOperator();
    return res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Ocorreu um erro ao buscar os dados", error });
  }
}