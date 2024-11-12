import { z } from "zod";
import { AccesRuleTimezoneService } from "../services/access-rule-timezone-service";
import { Request, Response } from "express";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";

const accessRuleTimeZoneSchema = z.object({
  accessRuleId: z.coerce.number(),
  timeZoneId: z.coerce.number(),
})

const accessRuleTimeZoneService = new AccesRuleTimezoneService()

export async function getAllAccessRuleTimeZones(req: Request, res: Response) {
  try {
    const accessRuleTimeZones = await accessRuleTimeZoneService.getAllAccessRuleTimeZones()
    res.json(accessRuleTimeZones)
  } catch (error) {
    res.status(500).json({ message: "Error getting access rule timezones", error })
  }
}

export async function getAccessRuleTimeZone(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const accessRuleTimeZone = await accessRuleTimeZoneService.getAccessRuleTimeZone(id)
    return res.json(accessRuleTimeZone)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule timezone", error });
  }
}

export async function getAccessRuleTimeZonesByLobby(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby)
    const accessRuleTimeZones = await accessRuleTimeZoneService.getAccessRuleTimeZonesByLobby(lobbyId)
    return res.json(accessRuleTimeZones)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule timezones", error });
  }
}

export async function createAccessRuleTimeZone(req: Request, res: Response) {
  try {
    const { accessRuleId, timeZoneId } = accessRuleTimeZoneSchema.parse(req.body)
    const accessRuleTimeZone = await accessRuleTimeZoneService.createAccessRuleTimeZone({ accessRuleId, timeZoneId })
    return res.status(201).json(accessRuleTimeZone)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error creating access rule timezone", error });
  }
}

export async function updateAccessRuleTimeZone(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const { accessRuleId, timeZoneId } = accessRuleTimeZoneSchema.partial().parse(req.body)
    const accessRuleTimeZone = await accessRuleTimeZoneService.updateAccessRuleTimeZone(id, { accessRuleId, timeZoneId })
    return res.json(accessRuleTimeZone)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error updating access rule timezone", error });
  }
}

export async function deleteAccessRuleTimeZone(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const accessRuleTimezone = await accessRuleTimeZoneService.deleteAccessRuleTimeZone(id)
    return res.json(accessRuleTimezone)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ message: "Error deleting access rule timezone", error });
  }
}