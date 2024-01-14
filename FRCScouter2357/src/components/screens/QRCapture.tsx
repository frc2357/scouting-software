import { Box, Button, Text } from '@react-native-material/core';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCodeScanner,
} from 'react-native-vision-camera';
import React, { useEffect } from 'react';
import { TQRCaptureProps } from '../../../types';

export const QRCapture: React.FC<TQRCaptureProps> = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
      console.log(codes[0].value);
    },
  });

  useEffect(() => {
    if (!hasPermission) {
      console.log('No permission');
      requestPermission();
    } else {
      console.log('Permission granted');
    }
  }, [hasPermission]);

  const cam =
    device === null ? (
      <Text>No camera</Text>
    ) : (
      <Camera
        style={{ height: '90%', width: '100%' }}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    );

  return (
    <Box>
      {cam}
      <Button
        title="Next"
        variant="contained"
        onPress={() => {
          navigation.navigate('TeleopLayout');
        }}
      />
    </Box>
  );
};