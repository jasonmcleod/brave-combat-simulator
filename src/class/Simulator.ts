import * as blessed from 'blessed';
import { GAME_TICK_SPEED } from '../app';
import { CharacterType } from '../lib/shared';
import { Util } from '../lib/Util';
import { Character } from './Character';
import { Events, SimulatorCreatedEvent, SimulatorCreatedData, SimulatorStoppedData, SimulatorStoppedEvent, SimulatorTickEvent } from './Events';

export class Simulator {
  public UI: blessed.Widgets.ListElement;
  public run: number = 0;
  public player: Character;
  public foes: Character[] = [];
  private interval: NodeJS.Timeout;
  
  constructor() {
    this.UI = blessed.list({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 20,
      content: 'CombatLog',
      tags: true,
    });
    
    Events.emit(SimulatorCreatedEvent, { simulator: this} as SimulatorCreatedData);
  }
  
  // create the player for this fight
  setPlayer(player: Character) {
    this.player = player;
    this.player.type = CharacterType.Player;
  }
  
  // add an NPC into the fight
  addFoe(foe: Character) {
    this.foes.push(foe);
    foe.id = this.foes.length;
    foe.type = CharacterType.Npc;
    
    // position this NPCs UI element
    foe.UI.top = foe.id;
  }
  
  // main attack loop that runs one each tick
  attack(attacker: Character, target: Character) {
    
    // determine if this attacker can attack at on this tick based on their attackSpeed
    if(attacker.lastAttackAt <= Date.now() - attacker.attackSpeed) {
      
      // determine the hitValue for this attacker;
      const hitValue = attacker.attackValue;
      // todo: consider armor
      // const blockValue = target.blockValue;
      
      // add the hit to the combat log
      this.applyHit(attacker, target, hitValue);
    }
  }
  
  applyHit(attacker: Character, target: Character, hitValue: number) {
    this.UI.add(`${attacker.id ? `NPC ${Util.pad(attacker.id, 3)}` : Util.pad('Player', 4)} hit ${target.id ? `NPC ${Util.pad(target.id, 3)}` : Util.pad('Player', 4)} for ${hitValue}`);
    this.UI.setScrollPerc(100);
    target.hp -= hitValue;
    if(target.hp <=0) {        
      target.die();
    }
    attacker.lastAttackAt = Date.now();
  }
  
  process() {
    // if the player has no target, or their target is dead, pick a new one
    if(!this.player.target || this.player.target.dead){
      const livingNpcs = this.foes.filter((n: Character) => !n.dead);
      if(livingNpcs.length) {
        this.player.setTarget(livingNpcs[0]);
      } else {
        this.stop('Nothing left for player to target')
      }      
    } 
    
    // have the player attack its target
    this.attack(this.player, this.player.target);
    this.player.UI.setText(this.player.getReadout());
    
    // loop over all NPCs and let em attack
    for(let n of this.foes) {
      this.attack(n, this.player);
      n.UI.setText(n.getReadout());
    }
  }
  
  start() {
    this.interval = setInterval(() => {
      this.process();      
      if(this.player.dead) {
        this.stop('Player died');
      }
      Events.emit(SimulatorTickEvent);
    }, GAME_TICK_SPEED);
  }
  
  stop(outcome: string) {
    clearInterval(this.interval);
    
    this.player.UI.setText(this.player.getReadout());
    
    // loop over all NPCs and let em attack
    for(let n of this.foes) {
      n.UI.setText(n.getReadout());
    }
    
    Events.emit(SimulatorStoppedEvent, { outcome } as SimulatorStoppedData)
  }
}