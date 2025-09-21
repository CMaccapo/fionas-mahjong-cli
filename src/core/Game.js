import Wall from "../models/Wall.js";
import Player from "../models/Player.js";
import Boneyard from "../models/Boneyard.js";

export default class Game {
  constructor(ui) {
    this.ui = ui;
    this.tiles = [];
    this.wall = new Wall();
    this.boneyard = new Boneyard();
    this.players = [];
  }

  setup() {
    // Shuffle wall, assign dealer, deal tiles
  }

  exchangePointsPhase() {
    // Handle point tile exchange
  }

  goldenTilePhase() {
    // Draw golden tile from tail
  }

  mainPlayPhase() {
    // Game loop: takeTurn until win
  }

  scoringPhase() {
    // Calculate and assign points
  }

  start() {
    this.setup();
    this.exchangePointsPhase();
    this.goldenTilePhase();
    this.mainPlayPhase();
    this.scoringPhase();
  }

  takeTurn(player) {
    // Draw -> discard or call
  }

  endHand() {
    // Cleanup state after a hand
  }

  endGame() {
    // Final scoring
  }
}
