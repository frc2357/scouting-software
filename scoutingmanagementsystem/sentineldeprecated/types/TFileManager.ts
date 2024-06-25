import { TLog, TLogStructure } from '.';

export type TFileManager = {
  createBaseDirs: () => Promise<void>;
  unzipAssignment: (assignmentB64: string) => Promise<string>;
  unzipB64: (inputB64: string, outFilePath: string, fileName: string) => Promise<string>;
  saveLog: (log: TLog) => Promise<string>;
  getZippedLog: (path: string) => Promise<string>;
  getEventLogInfo: (eventName: string) => Promise<{ name: string; path: string }[]>;
  getLogStructure: () => Promise<TLogStructure>;
  deleteFile: (path: string) => Promise<void>;
  getLastMatchNumber: (eventName: string) => Promise<number>;
};
