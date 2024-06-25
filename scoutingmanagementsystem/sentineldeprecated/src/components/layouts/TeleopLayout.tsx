import React, { Dispatch, useState } from 'react';
import { Box, Button, HStack, Pressable, Text } from '@react-native-material/core';
import { GestureResponderEvent, Image, StyleSheet } from 'react-native';
import noteImage from '../../../assets/note.png';
import emptyImage from '../../../assets/empty.png';
import { GamepieceButton } from '../basics/GamepieceButton';
import { ERobotState } from '../../../types/ERobotState';
import { useEventCreator } from '../../hooks/useEventCreator';
import { RadioButton } from 'react-native-paper';
import {
  ELogActionType,
  EPickupLocation,
  EScoreLocation,
  TAssignment,
  TEvent,
  TLogAction,
  TTeleopLayoutProps,
} from '../../../types';
import scoringImage from '../../../assets/scoring.png';
import scoringMirroredImage from '../../../assets/scoringMirrored.png';
import sourceImage from '../../../assets/source.png';
import floorImage from '../../../assets/floor.png';
import { useLogDispatch } from '../../contexts/LogContext';
import { useAssignment } from '../../contexts/AssignmentContext';
import { ViewTimer } from '../basics/ViewTimer';

const pickupStationNames: EPickupLocation[] = Object.values(EPickupLocation);
const numPickupStations: number = pickupStationNames.length;

export const TeleopLayout: React.FC<TTeleopLayoutProps> = ({
  route: {
    params: { initialRobotState },
  },
  navigation,
}: TTeleopLayoutProps): React.ReactNode => {
  const [leave, setLeave] = useState<'checked' | 'unchecked'>('unchecked');
  const [robotState, setRobotState] = useState<ERobotState>(initialRobotState);
  const [lastPickup, setLastPickup] = useState<TEvent>();
  const [lastScore, setLastScore] = useState<TEvent>();
  const [pickupStates, setPickupStates] = useState(
    new Array(numPickupStations).fill(ERobotState.empty)
  );
  const [noteIconVisible, setNoteIconVisible] = useState(false);
  const [noteIconCoords, setNoteIconCoords] = useState({ x: 0, y: 0 });
  const eventCreator = useEventCreator();
  const logDispatch: Dispatch<TLogAction> = useLogDispatch();
  const assignment: TAssignment = useAssignment();

  const robotStateToImage: (state: ERobotState) => number = (state: ERobotState): number => {
    switch (state) {
      case ERobotState.note:
        return noteImage;
      default:
        return emptyImage;
    }
  };

  const showNoteIcon: (x: number, y: number) => void = (x: number, y: number): void => {
    setNoteIconVisible(true);
    const newNoteIconCoords = {
      x,
      y,
    };
    setNoteIconCoords(newNoteIconCoords);

    setTimeout((): void => setNoteIconVisible(false), 500);
  };

  const clearRobotStateAndPickup: () => void = (): void => {
    setPickupStates(new Array(numPickupStations).fill(ERobotState.empty));
    setRobotState(ERobotState.empty);
  };

  const onEvent: (event: TEvent) => void = (event: TEvent): void => {
    if (lastPickup) {
      logDispatch({
        type: ELogActionType.addEvent,
        event: lastPickup,
      });
    }
    logDispatch({
      type: ELogActionType.addEvent,
      event: event,
    });
    clearRobotStateAndPickup();
    setLastScore(null);
    setLastPickup(null);
  };

  const onDrop: () => void = (): void => {
    onEvent(eventCreator.createDrop());
  };

  const onMiss: () => void = (): void => {
    const missScore = { ...lastScore, miss: true };
    onEvent(missScore);
  };

  const onScore: (location: EScoreLocation, x: number, y: number) => void = (
    location: EScoreLocation,
    x: number,
    y: number
  ): void => {
    const lastScore: TEvent = eventCreator.createScore(location, false, x, y);
    setLastScore(lastScore);
    clearRobotStateAndPickup();
  };

  const confirmScore: () => void = (): void => {
    if (lastScore) {
      onEvent(lastScore);
    }
  };

  const toEndgame: () => void = (): void => {
    logDispatch({
      type: ELogActionType.addEvent,
      event: eventCreator.createAuto(leave === 'checked'),
    });

    if (lastPickup) {
      logDispatch({
        type: ELogActionType.addEvent,
        event: lastPickup,
      });
      setLastPickup(null);
    }

    if (lastScore) {
      logDispatch({
        type: ELogActionType.addEvent,
        event: lastScore,
      });
      setLastScore(null);
    }

    navigation.navigate('Endgame');
  };

  const pickupStationStyles = [buttonStyles.sourcePressable, buttonStyles.floorPressable];
  const gamepieceStyles = [buttonStyles.sourceImage, buttonStyles.floorImage];
  const pickupStations: any[] = [];

  for (let i: number = 0; i < numPickupStations; i++) {
    pickupStations.push(
      <GamepieceButton
        key={pickupStationNames[i]}
        style={pickupStationStyles[i]}
        imageStyle={gamepieceStyles[i]}
        gamePieceSrc={robotStateToImage(pickupStates[i])}
        isHidden={pickupStates[i] === ERobotState.empty}
        setHidden={(isHidden) => {
          if (!isHidden) {
            const newPickupStates = new Array(numPickupStations).fill(ERobotState.empty);

            newPickupStates[i] = ERobotState.note;

            confirmScore();

            setLastPickup(eventCreator.createPickup(pickupStationNames[i]));

            setRobotState(newPickupStates[i]);

            setPickupStates(newPickupStates);
          }
        }}
      />
    );
  }

  return (
    <Box>
      <HStack spacing={0} style={styles.buttonStack}>
        <Text variant="body1">Team: {assignment?.currentMatch.teamNum ?? ''}</Text>
        <RadioButton.Item
          label="Leave"
          value="leave"
          status={leave}
          onPress={(): void => {
            setLeave(leave === 'unchecked' ? 'checked' : 'unchecked');
          }}
        />
        <Button
          variant="contained"
          title="Miss"
          onPress={onMiss}
          style={styles.button}
          disabled={!lastScore}
        />
        <Button
          variant="contained"
          title="Pass"
          onPress={onDrop}
          style={styles.button}
          disabled={robotState === ERobotState.empty}
        />
        <Button variant="contained" title="Endgame" onPress={toEndgame} style={styles.button} />
        <Image style={styles.robotState} alt="robotState" source={robotStateToImage(robotState)} />
        <ViewTimer />
      </HStack>
      <Box style={styles.images}>
        <Image
          alt="Field"
          source={assignment.alliance === 'BLUE' ? scoringImage : scoringMirroredImage}
          style={styles.field}
        />
        <Image alt="double substation" source={sourceImage} style={styles.source} />
        <Image alt="floor intake" source={floorImage} style={styles.floor} />
        <Pressable
          style={styles.field}
          onPress={(event: GestureResponderEvent): void => {
            if (robotState === ERobotState.empty) {
              return;
            }
            const x: number = event.nativeEvent.locationX;
            const y: number = event.nativeEvent.locationY;
            showNoteIcon(x - 25, y - 25);
            onScore(EScoreLocation.speaker, x, y);
          }}
          pressEffect={'none'}
        />
        <Pressable
          // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
          style={{
            ...(() =>
              assignment.alliance === 'BLUE' ? styles.blueAmpPressable : styles.redAmpPressable)(),
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
          onPress={(): void => {
            if (robotState === ERobotState.empty) {
              return;
            }
            showNoteIcon(570, 15);
            onScore(EScoreLocation.amp, 0, 0);
          }}
          disabled={robotState === ERobotState.empty}
        />
        {noteIconVisible && (
          <Image
            alt="note"
            source={noteImage}
            style={{
              ...styles.noteIcon,
              left: noteIconCoords.x,
              top: noteIconCoords.y,
            }}
          />
        )}
        {pickupStations}
      </Box>
    </Box>
  );
};

const baseStyles = StyleSheet.create({
  gamepiece: {
    height: 70,
    position: 'absolute',
    width: 70,
  },
});

const styles = StyleSheet.create({
  noteIcon: {
    resizeMode: 'stretch',
    position: 'absolute',
    height: 50,
    width: 50,
  },
  blueAmpPressable: {
    height: 80,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 215,
  },
  redAmpPressable: {
    height: 80,
    left: 485,
    position: 'absolute',
    top: 0,
    width: 215,
  },
  button: {
    width: 120,
    marginTop: 10,
  },
  buttonStack: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-evenly',
    margin: 4,
  },
  field: {
    height: 495,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 700,
  },
  floor: {
    height: 235,
    left: 705,
    position: 'absolute',
    top: 261,
    width: 325,
  },
  images: {
    marginTop: 10,
  },
  robotState: {
    height: 50,
    width: 50,
    marginTop: 8,
  },
  source: {
    height: 256,
    left: 705,
    position: 'absolute',
    top: 0,
    width: 325,
  },
});

const buttonStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  sourcePressable: {
    ...styles.source,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  floorPressable: {
    ...styles.floor,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  sourceImage: {
    ...baseStyles.gamepiece,
    left: 120,
    top: 110,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  floorImage: {
    ...baseStyles.gamepiece,
    left: 135,
    top: 90,
  },
});
