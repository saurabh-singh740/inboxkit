import { User, IUser } from '../models/User';

// Visually distinct palette — warm/cool alternates for easy differentiation
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98FB98', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F0B27A', '#82E0AA', '#F1948A', '#AED6F1', '#A9CCE3',
  '#FAD7A0', '#A3E4D7', '#D2B4DE', '#ABEBC6', '#F9E79F',
];

export function getRandomColor(): string {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

export async function getOrCreateUser(rawUsername: string): Promise<IUser> {
  const username = rawUsername.trim();

  const existing = await User.findOne({ username });
  if (existing) return existing;

  const user = new User({ username, color: getRandomColor(), totalClaims: 0 });
  await user.save();
  return user;
}

export async function updateSocketId(
  userId: string,
  socketId: string | null,
): Promise<void> {
  await User.findByIdAndUpdate(userId, { socketId });
}
