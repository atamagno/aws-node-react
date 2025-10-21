import { Router } from "express";
import { getHouses, addHouse } from "../controllers/houseController";

const router = Router();

router.get("/house", getHouses);
router.post("/house", addHouse);

export default router;