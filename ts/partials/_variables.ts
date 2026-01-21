/**
 * Site-wide variables
 */

export const siteURL = "https://damn.dog";

// Legacy global variables for compatibility
export interface Wiki {
  pic: string;
  title: string;
  url: string;
  gid: string | number;
}

export interface Player {
  rounds: number;
  score: number;
  correct: number;
  incorrect: number;
  percent: number;
}

export const wiki: Wiki = {
  pic: '',
  title: '',
  url: '',
  gid: ''
};

export const player: Player = {
  rounds: 0,
  score: 0,
  correct: 0,
  incorrect: 0,
  percent: 0
};

export let roundsPlayed: number[] = [];
export let reroll = 0;
export let choices: any[] = [];
export let choiceids: number[] = [];
