import {Router} from 'express';
import {CameraController} from "../controllers/CameraController";

const router = Router();

router.get('/take', CameraController.takePhoto);
router.get('/stop', CameraController.stopTakePhoto);
router.get('/getAll', CameraController.getAllPhotos);

export default router;