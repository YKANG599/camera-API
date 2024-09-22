import { Router } from 'express';
import {FileSystemController} from "../controllers/FileSystemController";

const router = Router();

router.get('/getAvatar', FileSystemController.findAvatar);
router.get('/getFile', FileSystemController.getFile);
router.post('/writeFile', FileSystemController.writeFile);

export default router;