import { canDrawFromBoneyard, canCallMahjong, formSetWithTile, setKong } from "../core/RuleCheck.js";

const Actions = {
  async execGrab(choice, game) {
    switch (choice) {
      case "1": {
        let tile = this.drawFromWall(game, game.currentPlayer, "head");
        if (!tile) return {success: false, error: "Can't draw tile- head"};
        while (tile.type ==="points" && this.phase === "main") {
          tile = this.drawFromWall(game, game.currentPlayer, "tail");
          if (!tile) return {success: false, error: "Can't draw tile- tail"};
        }
        
        return { success: true };
      }

      case "2": {
        const set = formSetWithTile(game.currentPlayer, game.boneyard.aliveTile);
        if (!set) return {success: false, error: "Can't make set with last boneyard tile"};
        this.drawFromBoneyard(game, game.currentPlayer, set);

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
        if (!canCallMahjong(game.currentPlayer)) return { success: false, error: "Can't call mahjong" };
        return { success: true };
      }
      case "3": {
        const suitIndex = await chooseIndex(game.currentPlayer.hand.printIndex("suit"), "Suit", game.ui);
        if (!game.wall.suits[suitIndex]) return { success: false, error: "Invalid Suit Index" };
        const suit = game.wall.suits[suitIndex];

        const tileIndex = await chooseIndex(game.currentPlayer.hand.printIndex("tile"), "Tile", game.ui);
        if (!game.currentPlayer.hand.getBySuit(suit)[tileIndex]) return { success: false, error: "Invalid Tile Index" };
        const tile = game.currentPlayer.hand.getBySuit(suit)[tileIndex];
        
        const set = setKong(game.currentPlayer, tile);
        if (!set) return {success: false, error: "Can't make set with this tile"};
        
        if (this.revealSet(game.currentPlayer, set)) return {success: true};
        return {success: false, error: "Can't kong"};
      }

      default:
        return { success: false, error: "Invalid action choice" };
    }
  },
  async drawForWild(game, player){

    let tile = game.wall.drawFromTail();
    while (tile.type === "points"){
      tile = game.wall.drawFromTail();
    }

    await game.ui.renderBoard(game);
    return tile;
  },
  async drawFromWall(game, player, from = "head") {
    let tile
    if (from === "head") tile = game.wall.drawFromHead();
    else if (from === "tail") tile = game.wall.drawFromTail();

    player.hand.addTile(tile);

    await game.ui.renderBoard(game);
    return tile;
  },
  async drawFromBoneyard(game, player, set) {
    const tile = game.boneyard.draw();
    
    this.revealSet(player, set);

    await game.ui.renderBoard(game);
    return tile;
  },
  revealSet(player, set){
    player.hand.revealedSets.push(set);
    for (const aTile of set){
      if (player.hand.removeTile(aTile) === false) return false;
    }
    return true;
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