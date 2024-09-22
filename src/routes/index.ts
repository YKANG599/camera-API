import { Router } from 'express';
import uploadRoutes from './upload';
import screenShotRoutes from './screenShot';
import cameraRoutes from './camera';
import recordingRoutes from './recording';

const router = Router();

router.use('/upload', uploadRoutes);
router.use('/desktop', screenShotRoutes);
router.use('/camera', cameraRoutes);
router.use('/recording', recordingRoutes);


export default router;
