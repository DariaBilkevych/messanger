import express from 'express';
import protectRoute from '../middelwares/protect-route.js';
import {
  getUserData,
  getUsersForSidebar,
  searchUsers,
} from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', protectRoute, getUserData);
router.get('/chat-users', protectRoute, getUsersForSidebar);
router.get('/search', protectRoute, searchUsers);

export default router;
