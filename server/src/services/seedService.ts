import { Tile } from '../models/Tile';

export const GRID_SIZE = 50;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 2500
const INSERT_BATCH = 500;

export async function seedGridIfEmpty(): Promise<void> {
  const count = await Tile.countDocuments();

  if (count === TOTAL_TILES) {
    console.log(`[Seed] Grid intact — ${TOTAL_TILES} tiles present`);
    return;
  }

  if (count > 0) {
    console.warn(`[Seed] Partial grid (${count}/${TOTAL_TILES}) — wiping and re-seeding`);
    await Tile.deleteMany({});
  }

  console.log(`[Seed] Seeding ${TOTAL_TILES} tiles...`);

  const tiles: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      tiles.push({ x, y });
    }
  }

  // Batch insertMany to avoid hitting document-count limits in a single round-trip
  for (let i = 0; i < tiles.length; i += INSERT_BATCH) {
    await Tile.insertMany(tiles.slice(i, i + INSERT_BATCH), { ordered: false });
  }

  console.log(`[Seed] Done — ${TOTAL_TILES} tiles created`);
}
