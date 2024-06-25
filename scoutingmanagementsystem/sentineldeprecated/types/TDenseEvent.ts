import { EEndgameLocation } from './EEndgameLocation';
import { EEventTypes } from './EEventTypes';
import { EPickupLocation } from './EPickupLocation';
import { EScoreLocation } from './EScoreLocation';
import { EStartLocation } from './EStartLocation';

export type TDenseEvent = {
  t?: EEventTypes; // type
  c?: number; // timestamp
  l?: EStartLocation | EPickupLocation | EScoreLocation | EEndgameLocation; // location
  x?: number; // x
  y?: number; // y
  o?: boolean; // leave
  n?: string; // notes
  h?: boolean; // harmony
  s?: boolean; // spotlit
  r?: number; // trap
  m?: boolean; // miss
};
