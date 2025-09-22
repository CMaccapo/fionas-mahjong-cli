export default class Hand {
  constructor() {
    this.tiles = [];
  }

  get playableTiles() {
    return this.tiles.filter(tile => tile.type === "playable");
  }

  sortTiles(tiles) {
    const suitOrder = ["C", "●", "┇"];
    return [...tiles].sort((a, b) => {
      if (a.suit !== b.suit) {
        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
      }
      return a.value - b.value;
    });
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
    return `     |${sortedPlayable.map(t => t.toString()).join("||")}|
       Points: |${this.pointsTiles.map(t => t.toString()).join("||")}|`;
  }
}
