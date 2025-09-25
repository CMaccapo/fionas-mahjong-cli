export default class Boneyard {
  constructor() {
    this.tiles = [];
  }

  addTile(tile) {
    if (!Array.isArray(this.tiles)) {
      console.error('this.tiles is not an array');
      return false;
    }

    try {
      this.tiles.push(tile);
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
    return this.tiles.length > 0;
  }
}
