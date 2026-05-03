import { Router } from 'express';
import { getGrid, claimTile, getLeaderboard } from '../controllers/gridController';

const router = Router();

router.get('/', getGrid);
router.post('/claim', claimTile);
router.get('/leaderboard', getLeaderboard);

export default router;
