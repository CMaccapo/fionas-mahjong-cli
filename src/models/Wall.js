import Tile from "./Tile.js";

export default class Wall {
  constructor() {
    this.tiles = this.buildTiles();
    this.shuffle();
  }

  buildTiles() {
    const tiles = [];

    // --- Playable suits (108) ---
    const suits = ["●", "┇", "C"];
    for (const suit of suits) {
      for (let value = 1; value <= 9; value++) {
        for (let i = 0; i < 4; i++) {
          tiles.push(new Tile(suit, value, "playable"));
        }
      }
    }

    // --- Winds (16) ---
    const winds = ["winds"];
    for (let value = 1; value <= 4; value++) {
      for (let i = 0; i < 4; i++) {
        tiles.push(new Tile("winds", value, "points"));
      }
    }

    // --- Dragons (12) ---
    const dragons = ["dragons"];
    for (let value = 1; value <= 3; value++) {
      for (let i = 0; i < 4; i++) {
        tiles.push(new Tile("dragons", value, "points"));
      }
    }

    // --- Flowers (4, unique) ---
    for (let value = 1; value <= 4; value++) {
      tiles.push(new Tile("flowers", value, "points"));
    }

    // --- Seasons (4, unique) ---
    for (let value = 1; value <= 4; value++) {
      tiles.push(new Tile("seasons", value, "points"));
    }

    return tiles;
  }

  shuffle() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  drawFromHead() {
    return this.tiles.shift();
  }

  drawFromTail() {
    return this.tiles.pop();
  }

  drawGolden() {
    return this.drawFromTail();
  }
}
