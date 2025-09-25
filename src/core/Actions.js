const Actions = {
  async execute(choice, game) {
    switch (choice) {
      case "1": {
        
        return { success: true };
      }

      case "2": {
        return { success: true };
      }

      case "3": {
        return { success: true };
      }

      default:
        return { success: false, error: "Invalid action choice" };
    }
  },
  async drawFromWall(game, player, from = "head") {
    const tile = from === "head" ? await game.wall.drawFromHead() : await game.wall.drawFromTail();

    await game.ui.renderBoard(game);

    return tile;
  },
  async drawFromBoneyard(game, player) {
    return game.boneyard.draw();

    await game.ui.renderBoard(game);
  },
  async discardTile(game, player, tile) {
    game.boneyard.addTile(tile);

    await game.ui.renderBoard(game);
  },
  callSet(game, player, type, tiles) {
    // type: "pong" | "kong" | "mahjong"
    // Implementation will interact with TileRules + RuleCheck
  }
};


export default Actions;