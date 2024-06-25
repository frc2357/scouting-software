import React, { useEffect, useState } from 'react';
import { Text } from '@react-native-material/core';
import { useTimer } from '../../contexts/TimerContext';

export const ViewTimer: React.FC = (): React.ReactNode => {
  const timer = useTimer();
  const [timeSeconds, setTimeSeconds] = useState<string>(timer.getTimeSeconds().toFixed(0));

  useEffect((): void => {
    setInterval((): void => {
      setTimeSeconds(timer.getTimeSeconds().toFixed(0));
    }, 1000);
  }, []);

  return <Text variant="h6">{timeSeconds}</Text>;
};
