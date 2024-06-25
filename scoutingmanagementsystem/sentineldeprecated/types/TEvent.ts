import { EEndgameLocation } from './EEndgameLocation';
import { EEventTypes } from './EEventTypes';
import { EPickupLocation } from './EPickupLocation';
import { EScoreLocation } from './EScoreLocation';
import { EStartLocation } from './EStartLocation';

export type TEvent = {
  type: EEventTypes;
  timestamp: number;
  location?: EStartLocation | EPickupLocation | EScoreLocation | EEndgameLocation;
  x?: number;
  y?: number;
  leave?: boolean;
  notes?: string;
  harmony?: boolean;
  spotlit?: boolean;
  trap?: number;
  miss?: boolean;
};
