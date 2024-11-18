import express from 'express';
import protectRoute from '../middelwares/protect-route.js';
import {
  getUserData,
  getUsersForSidebar,
  searchUsers,
  updateName,
  updateAvatar,
  updatePassword,
  deleteAvatar,
} from '../controllers/user-controller.js';
import { upload } from '../middelwares/multer.js';

const router = express.Router();

router.get('/', protectRoute, getUserData);
router.get('/chat-users', protectRoute, getUsersForSidebar);
router.get('/search', protectRoute, searchUsers);

router.put('/update-name', protectRoute, updateName);
router.put(
  '/update-avatar',
  protectRoute,
  upload.single('avatar'),
  updateAvatar
);
router.put('/update-password', protectRoute, updatePassword);
router.delete('/delete-avatar', protectRoute, deleteAvatar);

export default router;
