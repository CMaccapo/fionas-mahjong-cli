import Wall from "../models/Wall.js";
import Player from "../models/Player.js";
import Boneyard from "../models/Boneyard.js";
import Actions from "./Actions.js";


export default class Game {
  constructor(players, ui) {
    this.ui = ui;
    this.tiles = [];
    this.wall = new Wall();
    this.boneyard = new Boneyard();
    this.players = players;
    this.currentPlayer = null;
    this.dealer = null;
    this.wild = null;
  }
  
  async start() {
    await this.setup();
    await this.mainPlayPhase();
    this.scoringPhase();
  }

  async setup() {
    this.dealer = this.rollDealer();
    const dealerIndex = this.players.findIndex(p => p.dealer);
    if (dealerIndex > 0) {
        this.players = [
            ...this.players.slice(dealerIndex),
            ...this.players.slice(0, dealerIndex)
        ];
    }
    this.currentPlayer = this.players[0];

    const roll = this.rollWallBreak(this.dealer);
    this.breakWall(roll);
  
    for (const player of this.players){
      await this.drawInitialHands(player);
    }
    for (const player of this.players){
      await this.replaceInitialPoints(player);
    }
    this.wild = this.wall.drawWild();

    //this.ui.renderBoard(this);
    //this.players.forEach(p => console.log(p.hand.toString()));
  }

  rollDealer(maxRerolls = 3) {
    let contenders = this.players;
    let attempt = 0;

    while (contenders.length > 1 && attempt < maxRerolls) {
      attempt++;
      let max = 0;
      let rolls = new Map();

      for (const player of contenders) {
        const dice = (Math.floor(Math.random() * 6) + 1) +
                     (Math.floor(Math.random() * 6) + 1);
        rolls.set(player, dice);
        console.log(`${player.name} rolls ${dice}`);

        if (dice > max) {
          max = dice;
        }
      }

      contenders = contenders.filter(p => rolls.get(p) === max);

      if (contenders.length > 1 && attempt < maxRerolls) {
        console.log(
          `Tie between ${contenders.map(p => p.name).join(", ")} — rolling again!`
        );
      }
    }

    //Fallback
    const dealer = contenders[0];
    dealer.makeDealer();
    console.log(
      `${dealer.name} is the dealer! (decided after ${attempt} attempt${attempt > 1 ? "s" : ""})`
    );
    
    return dealer;
  }

  rollWallBreak(dealer) {
    const roll = (Math.floor(Math.random() * 6) + 1) +
                 (Math.floor(Math.random() * 6) + 1);

    const seats = ["N", "W", "S", "E"];
    const dealerIndex = seats.indexOf(dealer.placement);

    const rotated = seats.slice(dealerIndex).concat(seats.slice(0, dealerIndex));

    const breakDir = rotated[(roll - 1) % 4];

    console.log(`Roll: ${roll}: Wall break: ${breakDir}`);
    return roll;
  }

  breakWall(roll){
    const sideLen = this.wall.printArr.length / 4;
    const seats = ["N", "W", "S", "E"];
    const dealerIndex = seats.indexOf(this.dealer.placement);
    const counts = (roll - 1+ dealerIndex) % 4; // 0 N 1 W 2 S 3 E
    
    const breakIndex = (sideLen*counts) - (roll);
    this.wall.break = breakIndex;

  }

  async drawInitialHands(player){
    while(player.hand.tiles.length < 16){
      for (let i = 0; i<4; i++){
        player.hand.addTile(await Actions.drawFromWall(this, player, "head"));
      }
    }
    if (player.dealer) {
      player.hand.addTile(await Actions.drawFromWall(this, player, "head"));
    }
  }

  async replaceInitialPoints(player) {
    player.pendingReplacements = player.hand.pointsTiles.length;
    let handLen = 16;
    if (player.dealer) handLen = 17;
    
    while (player.hand.playableTiles.length < handLen) {
      await this.drawPendingReplacements(player);
    }
  }

  async drawPendingReplacements(player) {
    let toDraw = player.pendingReplacements;
    player.pendingReplacements = 0;
    for (let i = 0; i < toDraw; i++){
      const newTile = await Actions.drawFromWall(this, player, "tail")

      player.hand.addTile(newTile);

      if (newTile.type === "points") {
        player.pendingReplacements++;
      }
    }
  }


  async mainPlayPhase() {
    while (!this.handIsOver()){
      let valid = false;
      let error = null;

      while (!valid) {
        await this.ui.waitForTurn(this, error);
        const result = await this.takeTurn();
        if (result.success) {
          valid = true;
          error = null;
        } else {
          valid = false;
          error = result.error;
        }
      }

      this.rotatePlayers();
    }
  }

  async takeTurn() {
    //console.clear();
    if (this.currentPlayer.hand.playableTiles.length === 16){
      const choiceGrab = await this.ui.askGrab(this.currentPlayer);
      const resultGrab = await Actions.execGrab(choiceGrab, this);
      if (!resultGrab.success) return resultGrab;
    }
    const choiceFull = await this.ui.askFull(this.currentPlayer);
    return await Actions.execFull(choiceFull, this);
  }

  rotatePlayers() {
    const index = this.players.indexOf(this.currentPlayer);
    const nextIndex = (index + 1) % this.players.length;
    this.currentPlayer = this.players[nextIndex];
  }

  scoringPhase() {
    // Calculate and assign points
  }

  endHand() {
    // Cleanup state after a hand
  }
  handIsOver () {
    return false;
  }

  endGame() {
    // Final scoring
  }
}
