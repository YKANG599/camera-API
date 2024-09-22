import { Router } from 'express';
import {ScreenShotController} from "../controllers/ScreenShotController";

const router = Router();

router.get('/take', ScreenShotController.takeScreenShot);
router.get('/stop', ScreenShotController.stopTakeScreenShot);
router.get('/getAll', ScreenShotController.getAllScreenShots);

export default router;