export interface CharacterStats {
    str: number;
    dex: number;
    int: number;
    con: number;
  }
  
  export interface WeaponStats {
    speed: number;
    high: number;
    low: number;
  }
  
  export enum CharacterType {
    Player = 'player',
    Npc = 'npc',
  }