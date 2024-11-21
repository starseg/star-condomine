import { z } from "zod";
import { AccessService } from "../services/access-service";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";
import { Request, Response } from "express";
import { InvalidDateError } from "../services/errors/invalid-date-error";

const accessSchema = z.object({
  startTime: z.string().datetime().pipe(z.coerce.date()),
  endTime: z.string().datetime().pipe(z.coerce.date()).nullable().optional(),
  local: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  comments: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  memberId: z.coerce.number(),
  lobbyId: z.coerce.number(),
  visitorId: z.coerce.number(),
  operatorId: z.coerce.number(),
})

const accessService = new AccessService()

export async function createAccess(req: Request, res: Response) {
  try {
    const access = accessSchema.parse(req.body)
    const createdAccess = await accessService.createAccess(access)
    return res.status(201).json(createdAccess)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ message: "Error creating access", error });
  }
}

export async function updateAccess(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const access = accessSchema.partial().parse(req.body)

    const updatedAccess = await accessService.updateAccess(id, access)
    return res.json(updatedAccess)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ message: "Error updating access", error });
  }
}

export async function deleteAccess(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const deletedAccess = await accessService.deleteAccess(id)
    return res.json(deletedAccess)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error deleting access", error });
  }
}

export async function getAccesses(Req: Request, res: Response) {
  try {
    const accesses = await accessService.getAllAccesses()
    return res.json(accesses)
  } catch (error) {
    return res.status(500).json({ message: "Error getting accesses", error });
  }
}

export async function getAccess(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const access = await accessService.getAccessById(id)
    return res.json(access)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access", error });
  }
}

export async function getAccessByLobby(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby)
    const accesses = await accessService.getAccessByLobby(lobbyId)
    return res.json(accesses)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting accesses", error });
  }
}

export async function getFilteredAccesses(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby)
    const query = z.string().optional().parse(req.query.query)

    const accesses = await accessService.getFilteredAccesses(lobbyId, query)

    return res.json(accesses)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: "Error getting accesses" });
  }
}

export async function generateReport(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby)
    const { from, to } = z.object({
      from: z.string().datetime().pipe(z.coerce.date()).optional(),
      to: z.string().datetime().pipe(z.coerce.date()).optional(),
    }).parse(req.query)

    const report = await accessService.generateReport(lobbyId, from, to)

    return res.json(report)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof InvalidDateError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error generating report", error });
  }
}