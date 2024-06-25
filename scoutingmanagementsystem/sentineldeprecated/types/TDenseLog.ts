import { TDenseEvent } from '.';

export type TDenseLog = {
  t: number; // teamNum
  m: number; // matchNum
  e: TDenseEvent[]; // events
  s: string; // scouter
  a: 'RED' | 'BLUE' | ''; // alliance
  p: '1' | '2' | '3' | ''; // alliancePos
};
