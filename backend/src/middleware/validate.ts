import { ZodError, z } from "zod";

import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger";

export const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ reqId: req.id, errors: error.issues }, "Request validation failed");
      const formattedErrors = error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
        code: e.code,
      }));
      return res.status(400).send({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};
