import React, { createContext, useContext, useReducer } from 'react';
import {
  EAssignmentActionType,
  TAssignment,
  TAssignmentAction,
  TAssignmentMatch,
  TInputAssignment,
} from '../../types';

const assignmentDefault: TAssignment = {
  alliance: '',
  event: '',
  matches: [],
  alliancePos: '',
};

const AssignmentContext: React.Context<TAssignment> = createContext<TAssignment>(assignmentDefault);

const AssignmentDispatchContext: React.Context<React.Dispatch<TAssignmentAction>> =
  createContext<React.Dispatch<TAssignmentAction>>(null);

export const useAssignment: () => TAssignment = (): TAssignment => {
  return useContext<TAssignment>(AssignmentContext);
};

export const useAssignmentDispatch: () => React.Dispatch<TAssignmentAction> =
  (): React.Dispatch<TAssignmentAction> => {
    return useContext<React.Dispatch<TAssignmentAction>>(AssignmentDispatchContext);
  };

export const AssignmentProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren) => {
  const [log, dispatch] = useReducer<React.Reducer<TAssignment, TAssignmentAction>>(
    assignmentReducer,
    assignmentDefault
  );

  return (
    <AssignmentContext.Provider value={log}>
      <AssignmentDispatchContext.Provider value={dispatch}>
        {children}
      </AssignmentDispatchContext.Provider>
    </AssignmentContext.Provider>
  );
};

export const assignmentReducer: React.Reducer<TAssignment, TAssignmentAction> = (
  assignment: TAssignment,
  action: TAssignmentAction
): TAssignment => {
  switch (action.type) {
    case EAssignmentActionType.load:
      const inputAssignment: TInputAssignment = JSON.parse(action.loadData ?? '');

      const newAssignment: TAssignment = {
        event: inputAssignment.e,
        alliance: inputAssignment.a,
        alliancePos: inputAssignment.ap,
        matches: [],
      };

      newAssignment.matches = inputAssignment.m.map(
        (inputMatch): TAssignmentMatch => ({
          matchNum: inputMatch.m,
          teamNum: inputMatch.t,
          scouter: inputMatch.s,
        })
      );

      const match: TAssignmentMatch | undefined = newAssignment.matches.find(
        (x: TAssignmentMatch): boolean => x.matchNum === (action?.matchNum ?? 0)
      );

      if (match === undefined) {
        newAssignment.currentMatch = newAssignment.matches[0];
      } else {
        newAssignment.currentMatch = match;
      }
      return newAssignment;
    case EAssignmentActionType.nextMatch:
      const nextMatch: TAssignmentMatch | undefined = assignment.matches.find(
        (x: TAssignmentMatch) => x.matchNum === (assignment.currentMatch?.matchNum ?? 0) + 1
      );
      assignment.currentMatch = nextMatch;
      return assignment;
  }
};
