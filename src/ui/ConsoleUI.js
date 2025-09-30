import readline from "readline";

export default class ConsoleUI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  ask(question) {
    return new Promise((resolve) =>
      this.rl.question(question, (ans) => resolve(ans.trim()))
    );
  }

  async renderBoard(game) {
    console.clear();
    await game.wall.printSquare(game.wild);
    for (const player of game.players){
      console.log(player.name, player.hand.numTiles);
    }

    // game.players.forEach(p => {
    //   console.log(`${p.name} (${p.placement}) hand: ${p.hand.toString()}`);
    // });
    await sleep(50);
  }

  async askGrab(player) {
    console.log(`${player.name}'s turn.`);
    console.log("Hand:", player.hand.toString());
    console.log("1) Grab From Wall");
    console.log("2) Grab From Boneyard");
    let choice;
    do {
      choice = await this.ask("Choose action: ");
    } while (!["1", "2"].includes(choice));
    return choice;
  }
  async askFull(player) {
    console.log(`${player.name}'s turn.`);
    console.log("Hand:", player.hand.toString());
    console.log("1) Discard");
    console.log("2) Call Mahjong");
    console.log("3) Reveal Kong");
    let choice;
    do {
      choice = await this.ask("Choose action: ");
    } while (!["1", "2", "3"].includes(choice));
    return choice;
  }

  async waitForTurn(game, errorMessage = null) {
    await this.renderBoard(game);
    if (errorMessage) console.log(errorMessage);
    await this.ask(`${game.currentPlayer.name}: Press ENTER to start your turn...`);
  }

  showMessage(msg) {
    console.log(msg);
  }

  close() {
    this.rl.close();
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}