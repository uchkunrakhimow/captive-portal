import { Router } from "express";
import { getExample } from "../controllers/homeController";

const router: Router = Router();
router.get("/", getExample);

export default router;
