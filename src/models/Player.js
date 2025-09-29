import Hand from "./Hand.js";
import { isPair } from "../core/TileRules.js";

export default class Player {
  constructor(name, placement) {
    this.name = name;
    this.placement = placement; // "N" | "S" | "E" | "W"
    this.hand = new Hand();
    this.points = 0;
    this.dealer = false;
    this.pendingReplacements = 0;
  }

  makeDealer() {
    this.dealer = true;
  }

  isDealer() {
    return this.dealer;
  }

  isWinning() {
  const tiles = this.hand.playableTiles;
  if (tiles.length !== 14 && tiles.length !== 17) return false;

  // Simple brute force check:
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i+1; j < tiles.length; j++) {
      const maybePair = [tiles[i], tiles[j]];
      if (isPair(maybePair)) {
        const rest = tiles.filter((_, idx) => idx !== i && idx !== j);
        if (this.canPartitionIntoSets(rest)) {
          return true;
        }
      }
    }
  }
  return false;
}

  canPartitionIntoSets(tiles) {
    if (tiles.length === 0) return true;

    // try pong/kong/series at start
    for (const fn of [isPong, isKong, isSeries]) {
      const subset = tiles.slice(0, fn === isKong ? 4 : 3);
      if (fn(subset)) {
        const rest = tiles.slice(subset.length);
        if (this.canPartitionIntoSets(rest)) return true;
      }
    }
    return false;
  }
}
