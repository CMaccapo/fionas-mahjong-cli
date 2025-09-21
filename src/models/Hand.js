export default class Hand {
  constructor() {
    this.tiles = [];
  }

  get playableTiles() {
    return this.tiles.filter(tile => tile.type === "playable");
  }
  get pointsTiles() {
    return this.tiles.filter(tile => tile.type === "points");
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  removeTile(tile) {
    const idx = this.tiles.indexOf(tile);
    if (idx >= 0) this.tiles.splice(idx, 1);
  }

  toString() {
    return `|${this.playableTiles.map(t => t.toString()).join("|")}|
    Points: |${this.pointsTiles.map(t => t.toString()).join("|")}|`;
  }
}
