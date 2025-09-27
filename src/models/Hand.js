import TileCollection from "./TileCollection.js";

export default class Hand extends TileCollection {
  constructor() {
    super();
  }

  get playableTiles() {
    return this.sortTiles(this.tiles.filter(tile => tile.type === "playable"));
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
  
  get pointsTiles() {
    return this.tiles.filter(tile => tile.type === "points");
  }

  toString() {
    return `
    ${this.getBySuit('C').map(t => t.toString()).join("")}
    ${this.getBySuit('●').map(t => t.toString()).join("")}
    ${this.getBySuit('┇').map(t => t.toString()).join("")}
      Points: ${this.pointsTiles.map(t => t.toString()).join("")}`;
  }
}
