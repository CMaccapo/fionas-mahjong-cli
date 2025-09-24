export default class ConsoleUI {
  async renderBoard(game) {
    console.clear();
    await game.wall.printSquare();

    game.players.forEach(p => {
      console.log(`${p.name} (${p.placement}) hand: ${p.hand.toString()}`);
    });

    await sleep(100);
  }

  renderGameState(game) {
    console.log("Wall tiles left:", game.wall.tiles.length);
    game.players.forEach(p => {
      console.log(`${p.name} (${p.placement}) hand: ${p.hand.toString()}`);
    });
  }

  promptPlayerAction(player) {
    return readlineSync.question(`${player.name}, choose action: `);
  }

  showMessage(msg) {
    console.log(msg);
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}