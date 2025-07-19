import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import jailbreakPrevention from '../middleware/jailbreakPrevention.js';
import { 
  createContentDraft,
  modifyContent,
  generateImagePrompt,
  generateImage,
  getUserProjects,
  getProject,
  deleteProject
} from '../controllers/contentController.js';

const router = express.Router();

// Content creation routes (with jailbreak prevention)
router.route('/draft').post(protect, jailbreakPrevention, createContentDraft);
router.route('/modify').post(protect, jailbreakPrevention, modifyContent);
router.route('/image-prompt').post(protect, jailbreakPrevention, generateImagePrompt);
router.route('/generate-image').post(protect, generateImage);

// Project management routes
router.route('/projects').get(protect, getUserProjects);
router.route('/projects/:id')
  .get(protect, getProject)
  .delete(protect, deleteProject);

export default router;