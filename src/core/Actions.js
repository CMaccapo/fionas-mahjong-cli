export function drawFromWall(game, player, from = "head") {
  return from === "head" ? game.wall.drawFromHead() : game.wall.drawFromTail();
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
