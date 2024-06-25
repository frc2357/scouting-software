import React, {
  Context,
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

const TimerContext: Context<[number, Dispatch<SetStateAction<number>>]> = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([0, (): number => 0]);

export const useTimer = () => {
  const [startTimeSeconds, setTime] = useContext(TimerContext);

  const getTimeSeconds: () => number = (): number => {
    const timestampSeconds: number = Date.now() / 1000 - startTimeSeconds;
    return Math.round((timestampSeconds + Number.EPSILON) * 100) / 100;
  };

  const start: () => void = (): void => {
    setTime(Date.now() / 1000);
  };

  return {
    getTimeSeconds,
    start,
  };
};

export const TimerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode => {
  const [time, setTime] = useState(0);

  return <TimerContext.Provider value={[time, setTime]}>{children}</TimerContext.Provider>;
};
