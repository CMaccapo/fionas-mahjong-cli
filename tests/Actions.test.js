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

    test("allows pong", async () => {
      addTilesToHand(player, [
        new Tile("●", 5),
        new Tile("●", 5),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      expect(game.boneyard.tiles.length).toBe(1);
      expect(game.currentPlayer.hand.playableTiles.length).toBe(2);
      expect(formSetWithTile(player, tile)).not.toBeNull();
      expect(canDrawFromBoneyard(game.currentPlayer, game.boneyard)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows kong", async () => {
      addTilesToHand(player, [
        new Tile("●", 5),
        new Tile("●", 5),
        new Tile("●", 5)
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows series 4.6", async () => {
      addTilesToHand(player, [
        new Tile("●", 4),
        new Tile("●", 6),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows series 34.", async () => {
      addTilesToHand(player, [
        new Tile("●", 3),
        new Tile("●", 4),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows series .67", async () => {
      addTilesToHand(player, [
        new Tile("●", 6),
        new Tile("●", 7),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows mahjong", async () => {
      let tiles = [];
      for (let i = 0; i < 15; i++){
        tiles.push(new Tile("●", 6));
      }
      tiles.push(new Tile("●", 5));
      addTilesToHand(player, tiles);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("allows mahjong final series", async () => {
      let tiles = [];
      for (let i = 0; i < 15; i++){
        tiles.push(new Tile("●", 6));
      }
      tiles.push(new Tile("●", 4));
      addTilesToHand(player, tiles);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(true);
    });
    test("fails no mahjong final pair mismatch", async () => {
      let tiles = [];
      for (let i = 0; i < 15; i++){
        tiles.push(new Tile("●", 6));
      }
      tiles.push(new Tile("●", 3));
      addTilesToHand(player, tiles);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(false);
    });
    test("fails non-suit series", async () => {
      addTilesToHand(player, [
        new Tile("C", 6),
        new Tile("C", 7),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(false);
    });
    test("fails non-suit pong", async () => {
      addTilesToHand(player, [
        new Tile("C", 5),
        new Tile("C", 5),
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(false);
    });
    test("fails pair", async () => {
      addTilesToHand(player, [
        new Tile("C", 5)
      ]);

      expect(game.boneyard.addTile(tile)).toBe(true);
      
      const result = await Actions.execGrab("2", game);
      expect(result.success).toBe(false);
    });
  });
});

beforeEach(() => {
  game = {
    boneyard: new Boneyard(),
    ui: { renderBoard: () => {} }, // no-op
  };

  player = new Player("Alice", "N");
  tile = { suit: "C", value: 5, type: "playable", toString: () => "C5" };
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

