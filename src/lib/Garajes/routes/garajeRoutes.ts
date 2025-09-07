import { Router } from "express";
import * as garajeCtrl from "../controllers/garajeCtrl";

const router = Router();

router.get("/", garajeCtrl.getAllCtrl);
router.get("/:id", garajeCtrl.getByIdCtrl);
router.post("/", garajeCtrl.createCtrl);
router.put("/:id", garajeCtrl.updateCtrl);
router.delete("/:id", garajeCtrl.deleteCtrl);

router.get("/municipio/:municipio_slug", garajeCtrl.getByMunicipioCtrl);

export default router;
