#!/usr/bin/env node
import Game from "../src/core/Game.js";
import ConsoleUI from "../src/ui/ConsoleUI.js";

const ui = new ConsoleUI();
const game = new Game(ui);

game.start();