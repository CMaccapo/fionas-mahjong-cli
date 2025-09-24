import Tile from "./Tile.js";

export default class Wall {
  constructor() {
    this.allTiles = this.buildTiles();
    this.tiles = [...this.allTiles];
    this.shuffle();
    this._break = null;
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

  printSquare(){
    const arrLen = this.tiles.length;
    const compressLen = 1;
    const sideLen = (arrLen / 4) / compressLen;
    const start = (arrLen - this.break)%arrLen;
    const symbolLen = 1;
    
    let lines = [];
    lines[0] = "  ";
    lines[sideLen] = "";

    let arr = Array(arrLen).fill(0);
    arr[0] = "H";
    arr[arrLen-1] = "T";

    for (let row = sideLen; row >= 0; row--){
        for (let col = 0; col < sideLen+1; col++){
            let char = "";
            if (row === 0){
                if (col === sideLen) lines[0] += " ".repeat(symbolLen);
                char = arr[invertIfNegative(arrLen, col-start)];
                lines[0] += char + " ".repeat(symbolLen);
            }
            else if (row < sideLen) {
                let firstChar = arr[invertIfNegative(arrLen, arrLen-row-start)];
                let lastChar = arr[invertIfNegative(arrLen, sideLen+(row-start))];

                lines[row] = `${firstChar}${" ".repeat(sideLen*symbolLen*2+symbolLen+1)}${lastChar}`;
            }
            else {
                if (col === 1) lines[sideLen] += " ".repeat(symbolLen)
                char =  arr[invertIfNegative(arrLen, arrLen-(sideLen+col+start))];
                lines[sideLen] += char + " ".repeat(symbolLen);
            }
        }
    }
    for (const line of lines){
        console.log(line);
    }
  }
}

function invertIfNegative(arrLen, index) {
    if (index < 0) {
        return arrLen + index;
    }
    return index ;
}
