export default class Hand {
  constructor() {
    this.tiles = [];
  }

  get playableTiles() {
    return this.tiles.filter(tile => tile.type === "playable");
  }

  getBySuit(suit) {
    return this.sortTiles(this.tiles.filter(tile => tile.suit === suit));
  }

  sortTiles(tiles) {
    return [...tiles].sort((a, b) => a.value - b.value);
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
    const sortedPlayable = this.sortTiles(this.playableTiles);
    return `
    |${this.getBySuit('C').map(t => t.toString()).join("||")}|
    |${this.getBySuit('●').map(t => t.toString()).join("||")}|
    |${this.getBySuit('┇').map(t => t.toString()).join("||")}|
      Points: |${this.pointsTiles.map(t => t.toString()).join("||")}|`;
  }
}
