import { Router } from "express";
import { getBids, addBid } from "../controllers/bidController";

const router = Router();

router.get("/bid/:houseId", getBids);
router.post("/bid", addBid);

export default router;