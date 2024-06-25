import { ELogActionType } from './ELogActionType';
import { TAssignmentBase } from './TAssignmentBase';
import { TEvent } from './TEvent';

export type TLogAction = {
  type: ELogActionType;
  event?: TEvent;
  assignment?: { teamNum: number; matchNum: number; scouter: string } & TAssignmentBase;
};
