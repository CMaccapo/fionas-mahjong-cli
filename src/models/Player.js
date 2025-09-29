import Hand from "./Hand.js";
import { isPair, isPong, isKong, isSeries } from "../core/TileRules.js";

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

  isWinning(extraTile = null) {
    const tiles = extraTile
      ? [...this.hand.playableTiles, extraTile]
      : [...this.hand.playableTiles];

    if (tiles.length !== 17) return false;

    // brute force: try every possible pair, then partition the rest
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
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

    const sorted = [...tiles].sort((a, b) => {
      if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
      return a.value - b.value;
    });

    // Try every possible 3- or 4-tile subset from the hand
    for (let size of [3, 4]) {
      for (let i = 0; i <= sorted.length - size; i++) {
        const subset = sorted.slice(i, i + size);

        // Only check valid meld sizes
        if (
          (size === 3 && (isPong(subset) || isSeries(subset))) ||
          (size === 4 && isKong(subset))
        ) {
          // remove those tiles (by index match, not just value)
          const rest = [...sorted];
          subset.forEach(tile => {
            const idx = rest.findIndex(
              r => r.suit === tile.suit && r.value === tile.value
            );
            if (idx !== -1) rest.splice(idx, 1);
          });

          if (this.canPartitionIntoSets(rest)) return true;
        }
      }
    }

    return false;
  }

}
