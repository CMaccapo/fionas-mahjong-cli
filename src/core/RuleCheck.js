export function canDrawFromBoneyard(player, boneyard) {
  return boneyard.isLastTileAlive();
}

export function canCallMahjong(player) {
  return player.isWinning();
}

export function canCallPong(player, tile) {
  return player.hand.hasTwoOf(tile);
}

export function canCallKong(player, tile) {
  return player.hand.hasThreeOf(tile);
}
