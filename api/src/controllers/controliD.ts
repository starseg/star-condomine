import { Request, Response } from "express";

export const push = async (req: Request, res: Response): Promise<void> => {
  console.log("Device ID: ", req.query.deviceId);
  res.json({
    verb: "POST",
    endpoint: "load_objects",
    body: { object: "users" },
    contentType: "application/json",
  });
};

export const result = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  res.json();
};
