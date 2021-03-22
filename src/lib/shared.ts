export const HP_REGEN_RATE = 2000;
export const CRIT_MODIFIER = 1.35;

export enum DamageTypes {
  Generic = 'generic'
};

export  interface HitData {
  type: string;
  value: number;
  crit: boolean;
}

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