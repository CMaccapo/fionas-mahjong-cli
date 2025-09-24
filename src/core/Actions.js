export async function drawFromWall(game, player, from = "head") {
  const tile = from === "head" ? await game.wall.drawFromHead() : await game.wall.drawFromTail();

  await game.ui.renderBoard(game);

  return tile;
}

export async function drawFromBoneyard(game, player) {
  return game.boneyard.draw();

  await game.ui.renderBoard(game);
}

export async function discardTile(game, player, tile) {
  game.boneyard.addTile(tile);

  await game.ui.renderBoard(game);
}

export function callSet(game, player, type, tiles) {
  // type: "pong" | "kong" | "mahjong"
  // Implementation will interact with TileRules + RuleCheck
}
