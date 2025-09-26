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
        const suitIndex = await chooseIndex(game.currentPlayer.hand.printIndex("suit"), "Suit", game.ui);
        if (!game.wall.suits[suitIndex]) return { success: false, error: "Invalid Suit Index" };
        const suit = game.wall.suits[suitIndex];

        const tileIndex = await chooseIndex(game.currentPlayer.hand.printIndex("tile"), "Tile", game.ui);
        if (!game.currentPlayer.hand.getBySuit(suit)[tileIndex]) return { success: false, error: "Invalid Tile Index" };
        const tile = game.currentPlayer.hand.getBySuit(suit)[tileIndex];
        
        return await this.discardTile(game, game.currentPlayer, tile);
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