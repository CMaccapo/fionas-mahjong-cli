export default class Boneyard {
  constructor() {
    this.tiles = [];
    this.aliveTile = null;
  }

  addTile(tile) {
    if (!Array.isArray(this.tiles)) {
      console.error('this.tiles is not an array');
      return false;
    }

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
