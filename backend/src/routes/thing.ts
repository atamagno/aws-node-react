import { z } from "zod";

import { Router } from "express";

import { validate } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth";
import { deleteThing, getThing, getThings, postThing, putThing } from "../controllers/thingController";

const router = Router();

const CreateThingSchema = z.object({
  description: z.string().min(1).max(255),
});

const UpdateThingSchema = z.object({
  id: z.uuid({ version: "v4" }),
  description: z.string().min(1).max(255),
});

router.get("/thing", authenticateToken, getThings);
router.get("/thing/:id", authenticateToken, getThing);
router.post("/thing", authenticateToken, validate(CreateThingSchema), postThing);
router.put("/thing", authenticateToken, validate(UpdateThingSchema), putThing);
router.delete("/thing/:id", authenticateToken, deleteThing);

export default router;
