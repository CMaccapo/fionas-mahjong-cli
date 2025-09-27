import Tile from "./Tile.js";
import DecayArray from "./DecayArray.js";

export default class Wall {
  constructor() {
    this.suits = ["C", "●", "┇"];
    this.allTiles = this.buildTiles();
    this.tiles = [...this.allTiles];
    this.shuffle();
    this._break = null;

    const stackCount = Math.ceil(this.tiles.length / 2);
    this.printArr = new DecayArray(stackCount, 2);
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
    for (const suit of this.suits) {
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
    this.printArr.shift();

    return tile;
  }

  drawFromTail() {
    const tile = this.tiles.pop();
    this.printArr.pop();

    return tile;
  }

  printSquare(wild) {
    let arr = this.printArr.toArray();
    arr = addHeadTailMarkers(arr);
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

                lines[row] = `${firstChar}${this.getBoneyardStr(lines, row)}${lastChar}  `;
            }
            else {
                if (col === 1) lines[sideLen] += " ".repeat(symbolLen)
                char =  arr[wrapIndex(arrLen, arrLen-(sideLen+col+start))];
                lines[sideLen] += char + " ".repeat(symbolLen);
            }
        }
    }
    lines[0] += "  ";
    lines[sideLen] += "   ";
    
    for (let line of lines){
        line = "  "+line;
        line = line.replace(/H   /g, "⚈ ⊃⥽");
        line = line.replace(/   H/g, "⥼⊂ ⚈");
        if (wild){
          line = line.replace(/T   /g, wild.toString());
          line = line.replace(/   T/g, wild.toString());
        }
        console.log(line);
    }
  }
  getBoneyardStr(lines, row) {
    const start = 2;
    const header = " ".repeat(9);
    const tail = " ".repeat(9);
    let mid = " ".repeat(20);
    if (row === start){
      mid = " "+ this.suits.join(" ".repeat(8));
    }
    else if (row > start){
      const i = row - start-1;
      //mid
    }
    return header+mid+tail;
  }
}

function wrapIndex(arrLen, index) {
  return ((index % arrLen) + arrLen) % arrLen;
}

function addHeadTailMarkers(arr) {
  const out = [...arr]; // shallow copy

  // find indices of all empty slots (" ")
  const emptyIndices = out
    .map((v, i) => (v === " " ? i : -1))
    .filter(i => i !== -1);

  // only add H/T if there are at least 2 empty slots
  if (emptyIndices.length >= 2) {
    // Head: last empty slot before the first non-empty number from the start
    const headIndex = emptyIndices.findLast(i => i < out.findIndex(v => v !== " "));
    
    // Tail: first empty slot after the last non-empty number from the end
    const tailIndex = emptyIndices.find(i => i > out.length - 1 - [...out].reverse().findIndex(v => v !== " "));

    if (headIndex !== undefined) out[headIndex] = "H";
    if (tailIndex !== undefined && tailIndex !== headIndex) out[tailIndex] = "T";
  }

  return out;
}
