const Actions = {
  async execGrab(choice, game) {
    switch (choice) {
      case "1": {
        
        return { success: true };
      }

      case "2": {
        return { success: true };
      }

      default:
        return { success: false, error: "Invalid action choice" };
    }
  },
  async execFull(choice, game) {
    switch (choice) {
      case "1": {
        const tileIndex = await chooseIndex(game.currentPlayer.hand, "Hand", game.ui);
        if (!game.currentPlayer.hand.playableTiles[tileIndex]) return { success: false, error: "Invalid Tile Index" };
        return await this.discardTile(game, game.currentPlayer, game.currentPlayer.hand.playableTiles[tileIndex]);
      }

      case "2": {
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
    if (!player.hand.removeTile(tile)) return {success: false, error: "Discard: Unable to remove tile from hand"};
    if (!game.boneyard.addTile(tile)) return {success: false, error: "Discard: Unable to add tile to boneyard"};

    await game.ui.renderBoard(game);
    return {success: true}
  },
  callSet(game, player, type, tiles) {
    // type: "pong" | "kong" | "mahjong"
    // Implementation will interact with TileRules + RuleCheck
  }
};

async function chooseIndex(pickFrom, name, ui) {
  const input = await ui.ask(`\n${name}: ${pickFrom}\nChoose index from ${name}: `);
  const index = parseInt(input, 10);
  if (Number.isNaN(index) || index < 0 || index >= pickFrom.length) return false;
  return index;
}


export default Actions;