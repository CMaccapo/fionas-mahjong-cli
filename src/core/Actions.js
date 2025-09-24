export async function drawFromWall(game, player, from = "head") {
  const tile = from === "head" ? await game.wall.drawFromHead() : await game.wall.drawFromTail();

  return tile;
}

export function drawFromBoneyard(game, player) {
  return game.boneyard.draw();
}

export function discardTile(game, player, tile) {
  game.boneyard.addTile(tile);
}

export function callSet(game, player, type, tiles) {
  // type: "pong" | "kong" | "mahjong"
  // Implementation will interact with TileRules + RuleCheck
}