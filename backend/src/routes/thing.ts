import { Router } from "express";

import { addThing, getThings } from "../controllers/thingController";

const router = Router();

router.get("/thing", getThings);
router.post("/thing", addThing);

export default router;
