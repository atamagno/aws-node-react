import { ZodError, z } from "zod";

import { NextFunction, Request, Response, Router } from "express";

import logger from "../utils/logger";
import { deleteThing, getThing, getThings, postThing, putThing } from "../controllers/thingController";

const router = Router();

const CreateThingSchema = z.object({
  description: z.string().min(1).max(255),
});

const UpdateThingSchema = z.object({
  id: z.uuid({ version: "v4" }),
  description: z.string().min(1).max(255),
});

const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
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

router.get("/thing", getThings);
router.get("/thing/:id", getThing);
router.post("/thing", validate(CreateThingSchema), postThing);
router.put("/thing", validate(UpdateThingSchema), putThing);
router.delete("/thing/:id", deleteThing);

export default router;
