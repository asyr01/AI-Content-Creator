import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  generateResponse, 
  getConversations, 
  getConversation, 
  deleteConversation 
} from '../controllers/geminiController.js';

const router = express.Router();

router.route('/chat').post(protect, generateResponse);
router.route('/conversations').get(protect, getConversations);
router.route('/conversations/:id')
  .get(protect, getConversation)
  .delete(protect, deleteConversation);

export default router;