export function isPong(tiles) {
  return tiles.length === 3 && tiles.every(t => t.value === tiles[0].value && t.suit === tiles[0].suit);
}

export function isKong(tiles) {
  return tiles.length === 4 && tiles.every(t => t.value === tiles[0].value && t.suit === tiles[0].suit);
}

export function isSeries(tiles) {
  if (tiles.length !== 3) return false;

  const numberSuits = ["C", "●", "┇"];

  const [a, b, c] = [...tiles].sort((x, y) => x.value - y.value);

  return (
    numberSuits.includes(a.suit) &&
    a.suit === b.suit &&
    b.suit === c.suit &&
    b.value === a.value + 1 &&
    c.value === b.value + 1
  );
}

export function isPair(tiles) {
  return tiles.length === 2 && tiles[0].suit === tiles[1].suit && tiles[0].value === tiles[1].value;
}
