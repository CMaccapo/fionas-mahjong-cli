export default class Boneyard {
  constructor() {
    this.tiles = [];
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  draw() {
    return this.tiles.pop();
  }

  isLastTileAlive() {
    return this.tiles.length > 0;
  }
}
