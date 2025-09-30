import { isPong, isKong, isSeries } from "./TileRules.js";

export function canDrawFromBoneyard(player, boneyard) {
  const tile = boneyard.aliveTile;
  if (!tile) return false;
  return formSetWithTile(player, tile) !== null;
}

export function canCallMahjong(player) {
  return player.isWinning();
}

export function setKong(player, tile) {
  const result = player.hand.tiles.filter( aTile => aTile.suit === tile.suit && aTile.value === tile.value);
  if (result.length !== 4) return null;
  return result;
}

export function formSetWithTile(player, tile) {
  // Check Mahjong first
  if (player.isWinning(tile)) {
    return [...player.hand.playableTiles, tile]; // return full winning hand
  }

  const testHand = [...player.hand.playableTiles, tile];

  // Pong / Kong checks
  const same = testHand.filter(t => t.suit === tile.suit && t.value === tile.value);
  if (same.length >= 3) {
    return same.slice(0, 3); // return Pong
  }
  if (same.length === 4) {
    return same; // return Kong
  }

  const tilesOfSuit = testHand
    .filter(t => t.suit === tile.suit)
    .sort((a, b) => a.value - b.value);

  for (let i = 0; i < tilesOfSuit.length - 2; i++) {
    const t1 = tilesOfSuit[i];
    const t2 = tilesOfSuit[i + 1];
    const t3 = tilesOfSuit[i + 2];
    if (t1.value + 1 === t2.value && t1.value + 2 === t3.value) {
      return [t1, t2, t3]; // return series
    }
  }

  return null; // no set found
}
