import * as blessed from 'blessed';
import { ATTR_POINTS } from '../app';
import { CharacterStats, CharacterType, CRIT_MODIFIER, DamageTypes, HitData, WeaponStats } from '../lib/shared';
import { Util } from '../lib/Util';
import { CharacterCreatedEvent, CharacterCreatedData, Events, CharacterDiedEvent, CharacterDiedData } from './Events';

export class Character {
  UI: blessed.Widgets.BoxElement = blessed.box({ top: 0, left: 0, width: '100%', height: 1, content: 'Test', tags: true, style: { fg: 'black', bg: 'green' }});
  
  // fixed stats
  public id: number = 0;
  public type: CharacterType;
  public level: number; // controlled by XP in the actual game, but hard coded in the sim
  
  // configurable stats
  public str: number;
  public dex: number;
  public int: number;
  public con: number;
  
  // calculated stats
  public hp: number;
  public dead: boolean;
  public target: Character;
  
  // weapon stats
  public weaponLow: number;
  public weaponHigh: number;
  public weaponSpeed: number;
  
  // armor stats
  public armorValue: number;
  
  // dynamic props
  public lastAttackAt: number = 0;
  
  constructor(level: number, characterStats: CharacterStats, weaponStats: WeaponStats, armorValue: number) {
    this.level = level;
    
    this.str = characterStats.str || 5;
    this.dex = characterStats.dex || 5;
    this.int = characterStats.int || 5;
    this.con = characterStats.con || 5;
    
    this.weaponSpeed = weaponStats.speed || 5;
    this.weaponLow = weaponStats.low || 5;
    this.weaponHigh = weaponStats.high || 5;
    
    this.armorValue = armorValue;
    
    this.spawn();
    Events.emit(CharacterCreatedEvent, { character: this } as CharacterCreatedData)    
  }

  // how much health is restored every 2 seconds
  get hpRegenRate() {
    return ~~(this.con / 3);
  }
  
  // dynamically calculate the character HP based on some formula
  get maxHp() {
    return 20 + (this.level * 15) + (this.con * 5) + (this.str * 2);
  }
  
  // dynamically calculate the character attackSpeed based on some formula
  get attackSpeed() {
    return ~~(this.weaponSpeed - (this.dex / 2 * 25));
  }

  // percent chance that the hit will be a critical hit
  get critChance() {
    return this.dex / 3;
  }
  
  // dynamically calculate the character damage output based on some formula
  // todo: does not consider any armor
  get attackData(): HitData {
    if(this.dead) return {value: 0, type: DamageTypes.Generic, crit: false};
    const weaponSkill = this.level; // use level as skill until weapon skills come into play
    let total = ~~(Util.range(this.weaponLow, this.weaponHigh)) * (1 + (weaponSkill/50) + (this.str/100) + (this.dex/200));
    const isCriticalHit = this.critChance > Util.range(0, 100); 
    return {value: ~~(total * (isCriticalHit ? CRIT_MODIFIER : 1)), type: DamageTypes.Generic, crit: isCriticalHit};
  }
  
  // dynamically calculate the character block rating based on some formula
  // todo: does not consider any armor
  get blockValue() {
    return this.armorValue;
  }
  
  // dynamically calculate the characters attribute points based on their level
  get attributePoints() {
    return (this.level - 1) * 2; // grant 2 attribute points per level
  }
  
  // dynamically calculate the characters remaining attribute points based on their level and current distribution
  get attributePointsFree() {
    return ATTR_POINTS + this.attributePoints - this.str - this.dex - this.int - this.con;
  } 

  // set this characters target
  setTarget(target: Character) {
    this.target = target;
  }

  // spawn this character
  spawn() {
    this.dead = false;
    this.hp = this.maxHp;
  }
  
  // flag the player as dead
  die() {
    this.hp = 0;
    this.UI.style.bg = 'red';
    this.dead = true;

    Events.emit(CharacterDiedEvent, { character: this} as CharacterDiedData)
  }
  
  // generate the readout for this character
  getReadout() {
    const name = this.type === CharacterType.Npc ? Util.pad(`NPC ${this.id}`, 10) : Util.pad('Player', 10);
    const level = Util.pad(this.level, 3);
    const hpValues = `${Util.pad(this.hp, 4)} / ${Util.pad(this.maxHp, 4)}`;
    const attackSpeed = Util.pad(this.attackSpeed, 6);
    const attackPowePrefix = this.attackData.crit ? '{black-bg}{white-fg}' : '';
    const attackPowerSuffix = this.attackData.crit ? '{/white-fg}{/black-bg}' : '';
    const attackPower = `${attackPowePrefix}${Util.pad(this.attackData.value, 6)}${attackPowerSuffix}`;
    const attrPoints = `${Util.pad(this.attributePoints, 3)} / ${Util.pad(this.attributePointsFree, 3)}`;
    return `${name} [Level: ${level}]  [HP: ${hpValues}]   [Attack speed: ${attackSpeed}]   [Attack power: ${attackPower}]   [ Attributes used/remaining: ${attrPoints}]`
  }
}