import { Router } from 'express';
import {RecordingController} from "../controllers/RecordingController";

const router = Router();

router.get('/start', RecordingController.startRecording);
router.get('/stop', RecordingController.stopRecording);
router.get('/getAll', RecordingController.getAllRecordings);

export default router;
