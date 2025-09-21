#!/usr/bin/env node
import Game from "../src/core/Game.js";
import ConsoleUI from "../src/ui/ConsoleUI.js";
import Player from "../src/models/Player.js";

const players = [
    new Player("Player N", "N"),
    new Player("Player W", "W"),
    new Player("Player S", "S"),
    new Player("Player E", "E")
];
const ui = new ConsoleUI();
const game = new Game(players, ui);

game.start();