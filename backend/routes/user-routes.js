import express from 'express';
import protectRoute from '../middelwares/protect-route.js';
import {
  getUserData,
  getUsersForSidebar,
} from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', protectRoute, getUserData);
router.get('/chat-users', protectRoute, getUsersForSidebar);

export default router;
