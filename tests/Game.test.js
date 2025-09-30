import Game from "../src/core/Game.js";
import Player from "../src/models/Player.js";

class FakeUI {
  constructor(inputLog) {
    this.inputLog = inputLog;
  }

  _rand(label) {
    const val = Math.floor(Math.random() * 12) - 1; // -1 to 10
    this.inputLog.push({ prompt: label, value: val });
    return String(val);
  }

  async ask() {
    return this._rand("ask");
  }
  async askGrab() {
    return this._rand("askGrab");
  }
  async askFull() {
    return this._rand("askFull");
  }
  async waitForTurn() {}
  async renderBoard() {}
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

    const origTakeTurn = game.takeTurn.bind(game);
    game.takeTurn = async () => {
      const result = await origTakeTurn();
      try {
        game.players.forEach((p) => {
          const len = p.hand.numTiles;
          if (p === game.currentPlayer) {
            expect(len).toBeGreaterThanOrEqual(16);
            expect(len).toBeLessThanOrEqual(17);
          } else {
            expect(len).toBe(16);
          }
        });
      } catch (err) {
        const recent = inputLog.slice(-10);
        console.error(
          "Test failed. Last 10 inputs:",
          recent.map(x => `${x.prompt}: ${x.value}`)
        );
        throw err;
      }
      return result;
    };

    await game.start();
  });
});
