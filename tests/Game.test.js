import Game from "../src/core/Game.js";
import Player from "../src/models/Player.js";

class FakeUI {
  constructor(inputLog) {
    this.inputLog = inputLog;
  }

  _rand() {
    const val = Math.floor(Math.random() * 12) - 1; // -1 to 10
    this.inputLog.push(val);
    return String(val);
  }

  async ask() {
    return this._rand();
  }
  async askGrab() {
    return this._rand();
  }
  async askFull() {
    return this._rand();
  }
  async waitForTurn() {
    return;
  }
  async renderBoard() {
    return;
  }
  showMessage() {}
  close() {}
}

describe("Dynamic Game Test", () => {
  it("should keep hand lengths valid during play", async () => {
    const inputLog = [];
    const players = [
      new Player("Player N", "N"),
      new Player("Player W", "W"),
      new Player("Player S", "S"),
      new Player("Player E", "E"),
    ];
    const game = new Game(players, new FakeUI(inputLog));

    // stop after 20 turns
    let turns = 0;
    game.handIsOver = () => turns++ > 20;

    // wrap takeTurn so we can assert and log
    const origTakeTurn = game.takeTurn.bind(game);
    game.takeTurn = async () => {
      const result = await origTakeTurn();
      try {
        game.players.forEach((p) => {
          const len = p.hand.playableTiles.length;
          if (p === game.currentPlayer) {
            expect(len).toBeGreaterThanOrEqual(16);
            expect(len).toBeLessThanOrEqual(17);
          } else {
            console.log(p.name, game.currentPlayer.name, len);
            expect(len).toBe(16);
          }
        });
      } catch (err) {
        console.error("Test failed after inputs:", inputLog);
        throw err;
      }
      return result;
    };

    await game.start();
  });
});
