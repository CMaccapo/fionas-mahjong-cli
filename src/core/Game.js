import Wall from "../models/Wall.js";
import Player from "../models/Player.js";
import Boneyard from "../models/Boneyard.js";

export default class Game {
  constructor(players, ui) {
    this.ui = ui;
    this.tiles = [];
    this.wall = new Wall();
    this.boneyard = new Boneyard();
    this.players = players;
    this.dealer = null;
    this.wild = null;
  }
  
  start() {
    this.setup();
    this.mainPlayPhase();
    this.scoringPhase();
  }

  setup() {
    this.dealer = this.rollDealer();
    const roll = this.rollWallBreak(this.dealer);
    this.breakWall(roll);
  
    for (const player of this.players){
      this.drawInitialHands(player);
      this.replaceInitialPoints(player);
    }
    this.wild = this.wall.drawWild();

    this.wall.printSquare();
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

  drawInitialHands(player){
    while(player.hand.tiles.length < 16){
      for (let i = 0; i<4; i++){
        player.hand.addTile(this.wall.drawFromHead());
      }
    }
    if (player.dealer) {
      player.hand.addTile(this.wall.drawFromHead());
    }
  }

  replaceInitialPoints(player) {
    player.pendingReplacements = player.hand.pointsTiles.length;
    let handLen = 16;
    if (player.dealer) handLen = 17;
    
    while (player.hand.playableTiles.length < handLen) {
      this.drawPendingReplacements(player);
    }
  }

  drawPendingReplacements(player) {
    let toDraw = player.pendingReplacements;
    player.pendingReplacements = 0;
    for (let i = 0; i < toDraw; i++){
      const newTile = this.wall.drawFromTail();

      player.hand.addTile(newTile);

      if (newTile.type === "points") {
        player.pendingReplacements++;
      }
    }
  }


  mainPlayPhase() {
    // Game loop: takeTurn until win
  }

  scoringPhase() {
    // Calculate and assign points
  }

  takeTurn(player) {
    // Draw -> discard or call
  }

  endHand() {
    // Cleanup state after a hand
  }

  endGame() {
    // Final scoring
  }
}
