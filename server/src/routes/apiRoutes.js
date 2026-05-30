import express from 'express';
import apiController from '../controllers/apiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/auth/guest', apiController.registerGuest);
router.get('/users', apiController.getUsers);
router.get('/messages', apiController.getMessages);
router.post('/messages', authMiddleware, apiController.postMessage);
router.get('/activities', apiController.getActivities);
router.post('/activities', authMiddleware, apiController.postActivity);
export default router;