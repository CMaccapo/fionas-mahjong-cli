import Hand from "./Hand.js";

export default class Player {
  constructor(name, placement) {
    this.name = name;
    this.placement = placement; // "N" | "S" | "E" | "W"
    this.hand = new Hand();
    this.points = 0;
    this.dealer = false;
  }

  isDealer() {
    return this.dealer;
  }

  isWinning() {
    // stub: delegate to TileRules later
    return false;
  }
}
