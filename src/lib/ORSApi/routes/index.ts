import { Router } from "express";
import * as ORSApiCtrl from "../controllers";

const router = Router();

router.post("/search", ORSApiCtrl.ORSApiSearchCtrl);
router.post("/reverse", ORSApiCtrl.ORSApiReverseCtrl);
router.post('/optimize', ORSApiCtrl.ORSApiOptimizeCtrl);

export default router;