import React, { useState } from 'react';
import { Box, Text, Button, Pressable, HStack } from '@react-native-material/core';
import { Image, StyleSheet } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import {
  ELogActionType,
  ERobotState,
  EStartLocation,
  TAssignmentMatch,
  TLogAction,
} from '../../../types';
import { useEventCreator } from '../../hooks/useEventCreator';
import { TPrematchScreenProps } from '../../../types';
import autoFieldImage from '../../../assets/autoField.png';
import { AssignmentTable } from '../tables/AssignmentTable';
import { useLogDispatch } from '../../contexts/LogContext';
import { useAssignment } from '../../contexts/AssignmentContext';
import { useTimer } from '../../contexts/TimerContext';

export const Prematch: React.FC<TPrematchScreenProps> = ({ navigation }) => {
  const locations: EStartLocation[] = Object.values(EStartLocation);

  const [startPosPressed, setStartPosPressed] = useState(new Array(locations.length).fill(false));
  const [preload, setPreload] = useState(ERobotState.empty);
  const logDispatch = useLogDispatch();
  const assignment = useAssignment();
  const eventCreator = useEventCreator();
  const timer = useTimer();

  const onConfirm = () => {
    let startPos: EStartLocation = EStartLocation.center;

    locations.forEach((location, i) => {
      if (startPosPressed[i]) {
        startPos = location;
      }
    });

    setStartPosPressed(new Array(locations.length).fill(false));
    setPreload(ERobotState.empty);

    const initLog: TLogAction = {
      type: ELogActionType.initLog,
      assignment: {
        teamNum: assignment?.currentMatch.teamNum ?? 0,
        scouter: assignment?.currentMatch.scouter ?? '',
        matchNum: assignment?.currentMatch.matchNum ?? 0,
        alliance: assignment.alliance,
        alliancePos: assignment.alliancePos,
      },
    };
    logDispatch(initLog);

    timer.start();

    const startEvent: TLogAction = {
      type: ELogActionType.addEvent,
      event: eventCreator.createStart(startPos),
    };
    logDispatch(startEvent);

    navigation.navigate('TeleopLayout', { initialRobotState: preload });
  };

  return (
    <Box>
      <Text variant="h4">Pre-Match</Text>
      <HStack spacing={2}>
        <AssignmentTable />
        <Box style={styles.form}>
          <Text variant="h6">Pre-Load:</Text>
          <RadioButtonList
            direction="row"
            labels={Object.values(ERobotState)}
            selected={preload}
            setSelected={(value: ERobotState) => setPreload(value)}
          />
          <Text variant="h5">Press start location:</Text>
        </Box>
      </HStack>
      <Image alt="Starting position" source={autoFieldImage} style={styles.autoField} />

      {posStyles.map((style, i) => {
        return (
          <Pressable
            key={i}
            // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
            style={{
              ...style,
              backgroundColor: startPosPressed[i] ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
            }}
            onPress={() => {
              const newArr = new Array(4).fill(false);
              newArr[i] = true;
              setStartPosPressed(newArr);
            }}
          />
        );
      })}
      <Button title="START" variant="contained" style={styles.confirm} onPress={onConfirm} />
    </Box>
  );
};

const autoAreaLeft = 12;
const autoAreaTop = 280;
const styles = StyleSheet.create({
  autoField: {
    height: 225,
    left: autoAreaLeft,
    position: 'absolute',
    top: autoAreaTop,
    width: 1000,
  },
  confirm: {
    position: 'absolute',
    top: 510,
    marginLeft: 12,
    width: 1000,
  },
  form: {
    marginLeft: 150,
    marginTop: 120,
  },
  posFour: {
    height: 225,
    left: autoAreaLeft + 220 + 185 + 220,
    position: 'absolute',
    top: autoAreaTop,
    width: 375,
  },
  posOne: {
    height: 225,
    left: autoAreaLeft,
    position: 'absolute',
    top: autoAreaTop,
    width: 220,
  },
  posThree: {
    height: 225,
    left: autoAreaLeft + 220 + 185,
    position: 'absolute',
    top: autoAreaTop,
    width: 220,
  },
  posTwo: {
    height: 120,
    left: autoAreaLeft + 220,
    position: 'absolute',
    top: autoAreaTop,
    width: 185,
  },
});
const posStyles = [styles.posOne, styles.posTwo, styles.posThree, styles.posFour];
