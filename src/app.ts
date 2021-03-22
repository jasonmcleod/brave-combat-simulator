import { Character } from './class/Character';
import { Simulator } from './class/Simulator';
import { Screen } from './class/Screen';

export const GAME_TICK_SPEED = 100;
export const ATTR_POINTS = 20;

// create a new blessed UI
new Screen();

// create a new simulator to dive combat
const sim = new Simulator();

// add a player to the fight
sim.setPlayer(new Character(12, { str: 14, dex: 14, int: 5, con: 5 },  { speed: 1600, low: 10, high: 15 }, 10));

// add 2 NPCs to the fight
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));
sim.addFoe(new Character(1,    { str: 5, dex: 5, int: 5, con: 5} ,   { speed: 2000, low: 1, high: 5 }, 10));

// start the simulation
sim.start();
