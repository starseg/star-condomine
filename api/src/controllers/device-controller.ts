import z from 'zod';
import { Request, Response } from 'express';
import { DevicesService } from '../services/devices-service';
import { ResourceNotFoundError } from '../services/errors/resource-not-found-error';

const devicesService = new DevicesService();

const deviceSchema = z.object({
  name: z.string(),
  ip: z.string().nullable(),
  ramal: z.number().nullable(),
  description: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  login: z.string().nullable(),
  password: z.string().nullable(),
  deviceModelId: z.number(),
  lobbyId: z.number(),
})

export async function createDevice(req: Request, res: Response) {
  try {
    const device = deviceSchema.parse(req.body);
    const createdDevice = await devicesService.createDevice(device);
    return res.status(201).json(createdDevice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error creating device' });
  }
}

export async function updateDevice(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const device = deviceSchema.partial().parse(req.body);

    const updatedDevice = await devicesService.updateDevice(id, device);
    return res.json(updatedDevice);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error updating device' });
  }
}

export async function deleteDevice(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    await devicesService.deleteDevice(id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error deleting device' });
  }
}

export async function getDevice(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const device = await devicesService.getDeviceById(id);
    return res.json(device);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error fetching device' });
  }
}

export async function getAllDevices(req: Request, res: Response) {
  try {
    const devices = await devicesService.getDevices()
    return res.json(devices);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching devices' });
  }
}

export async function getDeviceByLobby(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby);
    const devices = await devicesService.getDeviceByLobby(lobbyId);
    return res.json(devices);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error fetching devices' });
  }
}

export async function getFilteredDevices(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby);
    const { query, status } = z.object({
      query: z.string().optional(),
      status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    }).parse(req.query);


    const devices = await devicesService.getFilteredDevices(lobbyId, query, status);
    return res.json(devices);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error fetching devices' });
  }
}