import { Router } from 'express';
import { getOrCreateUser } from '../controllers/userController';

const router = Router();

router.post('/', getOrCreateUser);

export default router;
