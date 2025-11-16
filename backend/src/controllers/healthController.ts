import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger";
import { checkDbConnection } from "../services/thingService";

export const getHealth = async (req: Request, res: Response, next: NextFunction) => {
  logger.debug({ reqId: req.id }, "Starting health check");
  try {
    await checkDbConnection();
    logger.info({ reqId: req.id }, "Health check OK");
    res.status(200).json({
      status: "OK",
      database: "Connected",
      service: "Operational",
      uptime: process.uptime(),
    });
  } catch (error) {
    next(error);
  }
};
