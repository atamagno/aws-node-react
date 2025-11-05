import { Router } from "express";

import { addBid, getBids } from "../controllers/bidController";

const router = Router();

router.get("/bid/:houseId", getBids);
router.post("/bid", addBid);

export default router;
