import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export async function getOrCreateUser(
  req: Request, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.body as { username?: string };

    if (!username || typeof username !== 'string') {
      res.status(400).json({ success: false, error: 'username is required' });
      return;
    }

    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      res.status(400).json({ success: false, error: 'Username must be 2–20 characters' });
      return;
    }

    const user = await userService.getOrCreateUser(trimmed);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
