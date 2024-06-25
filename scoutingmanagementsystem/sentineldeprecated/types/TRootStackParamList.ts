import { ERobotState, TLog } from '.';

export type TRootStackParamList = {
  Startup: undefined;
  MatchLogs: undefined;
  QRCapture: undefined;
  Prematch: undefined;
  TeleopLayout: { initialRobotState: ERobotState };
  Endgame: undefined;
  QRShow: { routeName: keyof TRootStackParamList; path: string };
};
