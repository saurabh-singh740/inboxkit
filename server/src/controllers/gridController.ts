import { Request, Response, NextFunction } from 'express';
import * as gridService from '../services/gridService';

export async function getGrid(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tiles = await gridService.getFullGrid();
    res.json({ success: true, data: tiles, count: tiles.length });
  } catch (err) {
    next(err);
  }
}

export async function claimTile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { x, y, userId, username, color } = req.body as Record<string, unknown>;

    if (x === undefined || y === undefined || !userId || !username || !color) {
      res.status(400).json({ success: false, error: 'x, y, userId, username, color are required' });
      return;
    }

    const result = await gridService.claimTile(
      Number(x), Number(y),
      String(userId), String(username), String(color),
    );

    if (!result.success) {
      res.status(409).json({ success: false, error: result.reason });
      return;
    }

    res.json({ success: true, data: result.tile });
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboard(
  req: Request, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const leaderboard = await gridService.getLeaderboard();
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    next(err);
  }
}
