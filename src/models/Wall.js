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
            if (row === 0){
                if (arr[arrLen-start+col] !== undefined) {
                    lines[0] += arr[arrLen-start+col] + " ";
                }
                else if (arr[col-start] !== undefined) {
                    lines[0] += arr[col-start] + " ";
                }
            }
            else if (row < sideLen) {
                let firstChar = " ";
                let x = sideLen+(row-start);

                if (arr[arrLen-(row+start)] !== undefined) firstChar = arr[arrLen-(row+start)];
                else firstChar = arr[arrLen+(arrLen-(row+start))];
                if (arr[sideLen+(row-start)] === undefined) x = arrLen+(sideLen+(row-start));

                lines[row] = `${firstChar}${" ".repeat(sideLen*(symbolLen+1)+symbolLen)}${arr[x]}`;
            }
            else {
                if (arr[arrLen-(sideLen+col+start)] === undefined) {
                    lines[sideLen] += arr[arrLen+(arrLen-(sideLen+col+start))] + " ";
                }
                else{
                    lines[sideLen] += arr[arrLen-(sideLen+col+start)] + " ";
                }
            }
        }
    }
    for (const line of lines){
        console.log(line);
    }
  }
}
