import { Box, Text } from '@react-native-material/core';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCodeScanner,
  Code,
  CameraDevice,
} from 'react-native-vision-camera';
import React, { Dispatch, useState } from 'react';
import { EAssignmentActionType, TAssignmentAction, TQRCaptureProps } from '../../../types';
import { useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { useFileManager } from '../../hooks/useFileManager';

export const QRCapture: React.FC<TQRCaptureProps> = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const dispatch: Dispatch<TAssignmentAction> = useAssignmentDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const fileManager = useFileManager();
  const device: CameraDevice = useCameraDevice('back');

  const advance: (codes: Code[]) => Promise<void> = async (codes: Code[]): Promise<void> => {
    if (!codes[0].value) return;

    setLoading(true);

    const assignmentTxt: string = await fileManager.unzipAssignment(codes[0].value);
    const nextMatchNum: number =
      (await fileManager.getLastMatchNumber(JSON.parse(assignmentTxt ?? '')?.e ?? '')) + 1;

    const action: TAssignmentAction = {
      type: EAssignmentActionType.load,
      loadData: assignmentTxt,
      matchNum: nextMatchNum,
    };

    dispatch(action);

    setLoading(false);
    navigation.navigate<'Prematch'>('Prematch');
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: advance,
  });

  if (!hasPermission) {
    console.log('No permission');
    requestPermission();
  }

  const cam =
    device === null || !hasPermission ? (
      <Text>No camera</Text>
    ) : (
      <Camera
        style={{ height: '100%', width: '100%' }}
        device={device}
        isActive={!isLoading}
        codeScanner={codeScanner}
      />
    );

  return <Box>{cam}</Box>;
};
