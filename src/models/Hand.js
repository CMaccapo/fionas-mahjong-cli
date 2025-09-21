export default class Hand {
  constructor() {
    this.tiles = [];
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  removeTile(tile) {
    const idx = this.tiles.indexOf(tile);
    if (idx >= 0) this.tiles.splice(idx, 1);
  }

  toString() {
    return this.tiles.map(t => t.toString()).join(" ");
  }
}
