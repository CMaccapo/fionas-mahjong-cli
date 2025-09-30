import { isPong, isKong, isSeries } from "./TileRules.js";

export function canDrawFromBoneyard(player, boneyard) {
  const tile = boneyard.aliveTile;
  if (!tile) return false;
  return canFormSetWithTile(player, tile);
}

export function canCallMahjong(player) {
  return player.isWinning();
}

export function canCallPong(player, tile) {
  return player.hand.hasTwoOf(tile);
}

export function canCallKong(player, tile) {
  return player.hand.hasThreeOf(tile);
}

export function canFormSetWithTile(player, tile) {
  // Check Mahjong first
  if (player.isWinning(tile)) {
    return true;
  }

  const testHand = [...player.hand.playableTiles, tile];

  // Pong / Kong checks
  const same = testHand.filter(
    (t) => t.suit === tile.suit && t.value === tile.value
  );
  if (same.length >= 3) return true;
  if (same.length === 4) return true;

  // Series check
  const bySuit = testHand
    .filter((t) => t.suit === tile.suit)
    .map((t) => t.value)
    .sort((a, b) => a - b);

  for (let i = 0; i < bySuit.length - 2; i++) {
    if (bySuit[i] + 1 === bySuit[i + 1] && bySuit[i] + 2 === bySuit[i + 2]) {
      return true;
    }
  }

  return null;
}
