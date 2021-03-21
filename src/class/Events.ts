import * as blessed from 'blessed';
import { EventEmitter } from 'events';
import { Character } from './Character';
import { Simulator } from './Simulator';

export const Events = new EventEmitter();

export const SimulatorCreatedEvent = 'SimulatorCreated'
export interface SimulatorCreatedData {
  simulator: Simulator
};

export const SimulatorTickEvent = 'SimulatorTick'

export const SimulatorStoppedEvent = 'SimulatorStopped';
export interface SimulatorStoppedData {
  outcome: string
};

export const CharacterCreatedEvent = 'CharacterCreated'
export interface CharacterCreatedData {
  character: Character
};

export const CharacterDiedEvent = 'CharacterDied'
export interface CharacterDiedData {
  character: Character
};