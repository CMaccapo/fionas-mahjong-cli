import Actions from "../src/core/Actions.js";
import Boneyard from "../src/models/Boneyard.js";
import Player from "../src/models/Player.js";

// Common setup for each test
let game, player, tile;
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

// Map of actions → test cases
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
  // 🔜 add future actions here, e.g. drawFromWall, drawFromBoneyard, etc.
};

// Run tests dynamically
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
