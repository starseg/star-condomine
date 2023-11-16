import { Request, Response, NextFunction } from 'express';

export const logging = (req: Request, res: Response, next: NextFunction): void => {
  // Obtém informações relevantes da requisição
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent');

  // Registra as informações no console ou em um arquivo de log
  console.log(`${timestamp} - ${method} ${url} - User-Agent: ${userAgent}`);

  // Continue para a próxima middleware ou rota
  next();
};
