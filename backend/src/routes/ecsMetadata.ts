import { Router } from "express";

import { getAvailabilityZone, getMetadata, getStats } from "../controllers/ecsMetadataController";

const router = Router();

router.get("/ecs/availability-zone", getAvailabilityZone);
router.get("/ecs/metadata", getMetadata);
router.get("/ecs/stats", getStats);

export default router;
