import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createContentDraft,
  modifyContent,
  generateImagePrompt,
  getUserProjects,
  getProject,
  deleteProject
} from '../controllers/contentController.js';

const router = express.Router();

// Content creation routes
router.route('/draft').post(protect, createContentDraft);
router.route('/modify').post(protect, modifyContent);
router.route('/image-prompt').post(protect, generateImagePrompt);

// Project management routes
router.route('/projects').get(protect, getUserProjects);
router.route('/projects/:id')
  .get(protect, getProject)
  .delete(protect, deleteProject);

export default router;