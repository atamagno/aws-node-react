import { Router } from "express";

import {
  deleteThing,
  getThing,
  getThings,
  postThing,
  putThing,
} from "../controllers/thingController";

const router = Router();

router.get("/thing", getThings);
router.get("/thing/:id", getThing);
router.post("/thing", postThing);
router.put("/thing", putThing);
router.delete("/thing/:id", deleteThing);

export default router;
