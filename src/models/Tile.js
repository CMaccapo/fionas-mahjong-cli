const SYMBOLS = {
  winds: ["N","S","E","W"],      // East, South, West, North
  dragons: ["g","r","b"],         // Red, Green, White/Black
  flowers: ["❀","⚘","❋","☘"],    // Plum, Orchid, Chrysanthemum, Bamboo
  seasons: ["🌧","☀","🌥","❄"]     // Spring, Summer, Autumn, Winter
};

export default class Tile {
  constructor(suit, value, type = "playable") {
    this.suit = suit;
    this.value = value;
    this.type = type;
  }

  toString() {
    if (this.suit in SYMBOLS && SYMBOLS[this.suit][this.value - 1]) {
      return `| ${SYMBOLS[this.suit][this.value - 1]} |`;
    }
    return `|${this.suit}:${this.value}|`;
  }
}
