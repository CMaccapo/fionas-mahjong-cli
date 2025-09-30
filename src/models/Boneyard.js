import TileCollection from "./TileCollection.js";

export default class Boneyard extends TileCollection {
  constructor() {
    super();
    this.aliveTile = null;
  }

  addTile(tile) {
    try {
      this.tiles.push(tile);
      this.aliveTile = tile;
      return true;
    } catch (error) {
      console.error('Failed to add tile:', error);
      return false;
    }
  }

  draw() {
    return this.tiles.pop();
  }

  isLastTileAlive() {
    return  this.tiles[this.tiles.length-1] === this.aliveTile;
  }
}
