import readlineSync from "readline-sync";

export default class ConsoleUI {
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
