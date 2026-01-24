import express, { Router } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middlwares/auth';

const router = express.Router();



// ✅ Route
router.post(
  '/',
  auth(UserRole.USER),
  postController.createPost
);

export const postRouter: Router = router;
