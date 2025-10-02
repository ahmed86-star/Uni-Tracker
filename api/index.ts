import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

let serverInitialized = false;

async function initServer() {
  if (!serverInitialized) {
    await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    serverInitialized = true;
  }
  return app;
}

export default async function handler(req: any, res: any) {
  const app = await initServer();
  return app(req, res);
}
