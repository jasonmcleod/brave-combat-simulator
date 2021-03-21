import { CharacterCreatedEvent, CharacterCreatedData, Events, SimulatorCreatedEvent, SimulatorCreatedData, SimulatorTickEvent, SimulatorStoppedEvent, SimulatorStoppedData } from './Events';

import * as blessed from 'blessed';

export class Screen {
  constructor() {
    
    const screen = blessed.screen({
      smartCSR: true
    });

    screen.title = 'Brave Combat Simulator'
    
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    
    Events.on(CharacterCreatedEvent, (data: CharacterCreatedData) => {
      screen.append(data.character.UI);
    });
    
    Events.on(SimulatorCreatedEvent, (data: SimulatorCreatedData) => {
      screen.append(data.simulator.UI);
    });
    
    Events.on(SimulatorTickEvent, (data) => {
      screen.render();
    });
    
    Events.on(SimulatorStoppedEvent, (data: SimulatorStoppedData) => {
      const box = blessed.box({
        top: 'center',
        left: 'center',
        width: 40,
        height: 5,
        content: `Simulator stopped \n${data.outcome}`,
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0',
            bg: 'blue'
          },
          hover: {
            bg: 'green'
          }
        }
      });
      screen.append(box);
    });
    
  }
}