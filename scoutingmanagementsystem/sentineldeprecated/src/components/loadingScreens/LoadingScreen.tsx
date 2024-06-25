import { Box, Text, Button } from '@react-native-material/core';
import { LoadingSymbol } from '../basics/LoadingSymbol';
import React from 'react';
import { TLoadingScreenProps } from '../../../types';

export const LoadingScreen: React.FC<TLoadingScreenProps> = ({ message, buttonText, onPress }) => {
  const getButton = () => {
    return buttonText && onPress ? (
      <Button variant="outlined" title={buttonText} onPress={onPress} />
    ) : (
      <></>
    );
  };

  return (
    <Box>
      <LoadingSymbol />
      <Text variant="h5">{message}</Text>
      {getButton()}
    </Box>
  );
};
