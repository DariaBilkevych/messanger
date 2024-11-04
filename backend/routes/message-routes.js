import express from 'express';
import { getMessages, sendMessage } from '../controllers/message-controller.js';
import protectRoute from '../middelwares/protect-route.js';
import { upload } from '../middelwares/multer.js';

const router = express.Router();

router.post('/send/:id', protectRoute, upload.single('file'), sendMessage);
router.get('/:id', protectRoute, getMessages);

export default router;
