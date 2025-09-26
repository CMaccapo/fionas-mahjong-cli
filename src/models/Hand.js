export default class Hand {
  constructor() {
    this.tiles = [];
  }

  get playableTiles() {
    return this.sortTiles(this.tiles.filter(tile => tile.type === "playable"));
  }

  getBySuit(suit) {
    return this.sortTiles(this.tiles.filter(tile => tile.suit === suit));
  }

  getLongestInSuit() {
    const suits = ["C", "●", "┇"];
    let maxTiles = 0;
    for (const suit of suits){
      if (this.getBySuit(suit).length > maxTiles) maxTiles = this.getBySuit(suit).length;
    }
    return maxTiles;
  }
  printIndex(type){
    const suits = ["C", "●", "┇"];
    let suitStr = "   ";
    let lines = [];
    if (type === "tile"){
        const result = [];
        let pad = " ";
        for (let i = 0; i < this.getLongestInSuit(); i++) {
          if (i.length === 2) pad = "";
          result.push(`[${i}]${pad}`);
        }
        lines.push(result.join(' '));
      }
    for (const suit of suits){
      if (type === "suit"){
        suitStr = `[${suits.indexOf(suit)}]`;
      }
      lines.push(`\n ${suitStr} ${this.getBySuit(suit).map(t => t.toString()).join("")}`);
    }
    lines.push(`\n      Points: ${this.pointsTiles.map(t => t.toString()).join("")}`);
    return lines.join("");
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
  
  get pointsTiles() {
    return this.tiles.filter(tile => tile.type === "points");
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  removeTile(tile) {
    if (!Array.isArray(this.tiles)) {
      console.error('tiles is not an array');
      return false;
    }

    const idx = this.tiles.indexOf(tile);
    if (idx >= 0) {
      this.tiles.splice(idx, 1);
      return true;
    }

    return false;
  }

  toString() {
    return `
    ${this.getBySuit('C').map(t => t.toString()).join("")}
    ${this.getBySuit('●').map(t => t.toString()).join("")}
    ${this.getBySuit('┇').map(t => t.toString()).join("")}
      Points: ${this.pointsTiles.map(t => t.toString()).join("")}`;
  }
}
