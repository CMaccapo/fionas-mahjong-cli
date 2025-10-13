export default class TileCollection {
  constructor() {
    this.tiles = [];
  }

  sortTiles(tiles) {
    const suitOrder = { C: 0, "●": 1, "┇": 2 };

    return [...tiles].sort((a, b) => {
      if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      return a.value - b.value;
    });
  }

  getBySuit(suit) {
    return this.sortTiles(this.tiles.filter(tile => tile.suit === suit));
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  removeTile(tile) {
    if (this.tiles.length === 0 ) return false;

    const index = this.tiles.findIndex(t => t.equals(tile));
    if (index === -1) return false;
    this.tiles.splice(index, 1);
    
    return true;
  }
}
