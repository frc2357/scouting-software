export type TInputAssignment = {
  e: string; // event name
  a: 'RED' | 'BLUE' | ''; // alliance
  ap: '1' | '2' | '3' | ''; // alliance pos
  m: { m: number; t: number; s: string }[]; // matches: {matchNum, teamNum, scouter}
};
