import TileCollection from "./TileCollection.js";
import { isPong, isKong, isSeries, isPair } from "../core/TileRules.js";

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
  
  findAllPongs() {
    const results = [];
    const groups = this.groupBySuitAndValue();
    for (const tiles of Object.values(groups)) {
      if (tiles.length >= 3) {
        results.push(tiles.slice(0, 3));
      }
    }
    return results;
  }

  findAllKongs() {
    const results = [];
    const groups = this.groupBySuitAndValue();
    for (const tiles of Object.values(groups)) {
      if (tiles.length === 4) {
        results.push(tiles);
      }
    }
    return results;
  }

  findAllSeries() {
    const results = [];
    const bySuit = this.groupBySuit();
    for (const [suit, tiles] of Object.entries(bySuit)) {
      const sorted = tiles.sort((a, b) => a.value - b.value);
      for (let i = 0; i < sorted.length - 2; i++) {
        const seq = [sorted[i], sorted[i+1], sorted[i+2]];
        if (isSeries(seq)) results.push(seq);
      }
    }
    return results;
  }

  findAllPairs() {
    const results = [];
    const groups = this.groupBySuitAndValue();
    for (const tiles of Object.values(groups)) {
      if (tiles.length >= 2) {
        results.push(tiles.slice(0, 2));
      }
    }
    return results;
  }

  groupBySuitAndValue() {
    const groups = {};
    for (const tile of this.playableTiles) {
      const key = `${tile.suit}:${tile.value}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tile);
    }
    return groups;
  }

  groupBySuit() {
    const groups = {};
    for (const tile of this.playableTiles) {
      if (!groups[tile.suit]) groups[tile.suit] = [];
      groups[tile.suit].push(tile);
    }
    return groups;
  }
}
