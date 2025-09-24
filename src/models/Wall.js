import Tile from "./Tile.js";
import DecayArray from "./DecayArray.js";

export default class Wall {
  constructor() {
    this.allTiles = this.buildTiles();
    this.tiles = [...this.allTiles];
    this.shuffle();
    this._break = null;

    const stackCount = Math.ceil(this.tiles.length / 3);
    this.printArr = new DecayArray(stackCount, 3);
  }

  set break(breakIndex) {
    this._break = breakIndex;
  }

  get break() {
    return this._break;
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
    for (let value = 1; value <= 4; value++) {
      for (let i = 0; i < 4; i++) {
        tiles.push(new Tile("winds", value, "points"));
      }
    }

    // --- Dragons (12) ---
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
    const tile = this.tiles.shift();
    this.printArr.shift(); // decay from head
    return tile;
  }

  drawFromTail() {
    const tile = this.tiles.pop();
    this.printArr.pop(); // decay from tail
    return tile;
  }

  drawWild() {
    return this.drawFromTail();
  }

  printSquare() {
    const arr = this.printArr.toArray();
    const arrLen = arr.length;
    const sideLen = arrLen / 4;
    const start = (arrLen - this.break) % arrLen;
    const symbolLen = 1;

    let lines = [];
    lines[0] = "  ";
    lines[sideLen] = "";

    for (let row = sideLen; row >= 0; row--){
        for (let col = 0; col < sideLen+1; col++){
            let char = "";
            if (row === 0){
                if (col === sideLen) lines[0] += " ".repeat(symbolLen)
                char = arr[wrapIndex(arrLen, col-start)];
                lines[0] += char + " ".repeat(symbolLen);
            }
            else if (row < sideLen) {
                let firstChar = arr[wrapIndex(arrLen, arrLen-row-start)];
                let lastChar = arr[wrapIndex(arrLen, sideLen+(row-start))];

                lines[row] = `${firstChar}${" ".repeat(sideLen*symbolLen*2+symbolLen+1)}${lastChar}`;
            }
            else {
                if (col === 1) lines[sideLen] += " ".repeat(symbolLen)
                char =  arr[wrapIndex(arrLen, arrLen-(sideLen+col+start))];
                lines[sideLen] += char + " ".repeat(symbolLen);
            }
        }
    }
    for (const line of lines){
        console.log(line);
    }
  }
}

function wrapIndex(arrLen, index) {
  return ((index % arrLen) + arrLen) % arrLen;
}
