import Actions from "../src/core/Actions.js";
import Boneyard from "../src/models/Boneyard.js";
import Player from "../src/models/Player.js";
import Tile from "../src/models/Tile.js";
import Wall from "../src/models/Wall.js";
import { canDrawFromBoneyard, formSetWithTile, setKong } from "../src/core/RuleCheck.js";


function addTilesToHand(player, tiles) {
  for (const tile of tiles){
    player.hand.addTile(tile);
  }
  return player;
}

describe("Actions", () => {
  let game, player, boneyard;
  let tile = new Tile("●", 5);

  beforeEach(async () => {
    player = new Player("Test");
    game = {
      boneyard: new Boneyard(),
      ui: { 
        renderBoard: () => {}, 
        ask: async () => "0" },
      players: [player],
      currentPlayer: player,
      wall: new Wall()
    };
  });
  describe("execFull3 - Set Kong", () => {
    test("Pass: Set Kong on Turn", async () => {
      addTilesToHand(player, [
        new Tile("C", 5),
        new Tile("C", 5),
        new Tile("C", 5),
        new Tile("C", 5)
      ]);
      expect(game.currentPlayer.hand.tiles.length).toBe(4);
      const result = await Actions.execFull("3", game);
      expect(result.success).toBe(true);
    });
    test("Fail: Set Kong on Turn have pong", async () => {
      addTilesToHand(player, [
        new Tile("C", 5),
        new Tile("C", 5),
        new Tile("C", 5)
      ]);
      const result = await Actions.execFull("3", game);
      expect(result.success).toBe(false);
    });
    test("Fail: Set Kong on Turn, have series", async () => {
      addTilesToHand(player, [
        new Tile("C", 3),
        new Tile("C", 4),
        new Tile("C", 5),
        new Tile("C", 5)
      ]);
      const result = await Actions.execFull("3", game);
      expect(result.success).toBe(false);
    });
    test("Sad: no tiles", async () => {
      const result = await Actions.execFull("3", game);
      expect(result.success).toBe(false);
    });
    test("Sad: bad index", async () => {
      addTilesToHand(player, [
        new Tile("C", 5),
        new Tile("C", 5),
        new Tile("C", 5),
        new Tile("C", 5)
      ]);
      game.ui= { 
        renderBoard: () => {}, 
        ask: async () => "5" };
      const result = await Actions.execFull("3", game);
      expect(result.success).toBe(false);
    });
  });
  describe("Boneyard grabbing rules", () => {
    const defaultInputs = ["1", "0", "1", "1", "Y"];
    const charDefaultInputs = ["0", "0", "0", "1", "Y"];
    const kongInputs = ["1", "0", "1", "1", "N", "1", "2"]; 
    const cases = [
      {
        name: "allows pong",
        tiles: [ ["●", 5], ["●", 5] ],
        expectSuccess: true,
        inputs: defaultInputs,
      },
      {
        name: "allows kong",
        tiles: [ ["●", 5], ["●", 5], ["●", 5] ],
        expectSuccess: true,
        inputs: kongInputs,
      },
      {
        name: "allows series 4.6",
        tiles: [ ["●", 4], ["●", 6] ],
        expectSuccess: true,
        inputs: defaultInputs,
      },
      {
        name: "allows series 34.",
        tiles: [ ["●", 3], ["●", 4] ],
        expectSuccess: true,
        inputs: defaultInputs,
      },
      {
        name: "allows series .67",
        tiles: [ ["●", 6], ["●", 7] ],
        expectSuccess: true,
        inputs: defaultInputs,
      },
      {
        name: "fails non-suit series",
        tiles: [ ["C", 6], ["C", 7] ],
        expectSuccess: false,
        inputs: defaultInputs,
      },
      {
        name: "fails non-suit pong",
        tiles: [ ["C", 5], ["C", 5] ],
        expectSuccess: false,
        inputs: defaultInputs,
      },
      {
        name: "fails pair",
        tiles: [ ["C", 5] ],
        expectSuccess: false,
        inputs: defaultInputs,
      },
    ];

    test.each(cases)("$name", async ({ tiles, expectSuccess, extraCheck, inputs }) => {
      addTilesToHand(player, tiles.map(([s, n]) => new Tile(s, n)));
      expect(game.boneyard.addTile(tile)).toBe(true);

      let inputQueue = [...inputs];
      game.ui.ask = async () => inputQueue.shift() || "Y";

      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(expectSuccess);
      if (expectSuccess === true){
        expect(game.currentPlayer.hand.revealedSets.length).toBe(1);
        expect(game.currentPlayer.hand.playableTiles.length).toBe(0);
      }

      if (extraCheck) extraCheck(game);
    });

  });

});

beforeEach(() => {
  game = {
    boneyard: new Boneyard(),
    ui: { renderBoard: () => {} }, // no-op
  };

  player = new Player("Alice", "N");
  tile = new Tile ("C", 5);
  player.hand.addTile(tile);

  game.currentPlayer = player;
});

const actionTests = {
  discardTile: [
    {
      name: "removes tile from hand and adds to boneyard",
      setup: () => ({ args: [game, player, tile] }),
      expect: (result) => {
        expect(result.success).toEqual(true);
        expect(player.hand.tiles).not.toContainEqual(tile);
        expect(game.boneyard.tiles).toContainEqual(tile);
      },
    },
    {
      name: "returns failure if tile not in hand",
      setup: () => {
        const otherTile = { suit: "D", value: 2, type: "playable", toString: () => "D2" };
        return { args: [game, player, otherTile], otherTile };
      },
      expect: (result, { otherTile }) => {
        expect(result.success).toEqual(false);
        expect(game.boneyard.tiles).not.toContainEqual(otherTile);
      },
    },
  ],
};

for (const [actionName, cases] of Object.entries(actionTests)) {
  describe(`Actions.${actionName}`, () => {
    for (const testCase of cases) {
      test(testCase.name, async () => {
        const { args, ...ctx } = testCase.setup();
        const result = await Actions[actionName](...args);
        testCase.expect(result, ctx);
      });
    }
  });
}

