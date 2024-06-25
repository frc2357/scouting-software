import { TAssignmentBase } from './TAssignmentBase';
import { TAssignmentMatch } from './TAssignmentMatch';

export type TAssignment = {
  currentMatch?: TAssignmentMatch;
  event: string;
  matches: TAssignmentMatch[];
} & TAssignmentBase;
