import { Box, VStack, Button, Text } from '@react-native-material/core';
import React, { useEffect } from 'react';
import { TFileManager, TStartupProps } from '../../../types';
import { useFileManager } from '../../hooks/useFileManager';

export const Startup: React.FC<TStartupProps> = ({
  navigation,
}: TStartupProps): React.ReactNode => {
  const fileManager: TFileManager = useFileManager();

  useEffect((): void => {
    fileManager.createBaseDirs();
  }, []);

  return (
    <Box style={{ margin: 20, alignItems: 'center' }}>
      <VStack spacing={50}>
        <Text variant="h1">Scouting Management System: Sentinel</Text>
        <Button
          title="Match Logs"
          variant="contained"
          onPress={(): void => {
            navigation.navigate('MatchLogs');
          }}
        />
        <Button
          title="Scouting"
          variant="contained"
          onPress={() => {
            navigation.navigate('QRCapture');
          }}
        />
      </VStack>
    </Box>
  );
};
