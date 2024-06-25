import React, { useState } from 'react';
import {
  VStack,
  TextInput,
  HStack,
  Text,
  Button,
  Box,
  Divider,
  Spacer,
} from '@react-native-material/core';
import { StyleSheet, Dimensions } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { useEventCreator } from '../../hooks/useEventCreator';
import {
  EAssignmentActionType,
  EEndgameLocation,
  ELogActionType,
  TEndgameScreenProps,
  TEvent,
  TLog,
} from '../../../types';
import { RadioButton } from 'react-native-paper';
import { useLog, useLogDispatch } from '../../contexts/LogContext';
import { useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { useFileManager } from '../../hooks/useFileManager';

const windowDimensions = Dimensions.get('window');

export const Endgame: React.FC<TEndgameScreenProps> = ({ navigation }) => {
  const [endgameLocation, setEndgameLocation] = useState<EEndgameLocation>(EEndgameLocation.none);
  const [spotlit, setSpotlit] = useState<'checked' | 'unchecked'>('unchecked');
  const [harmony, setHarmony] = useState<'checked' | 'unchecked'>('unchecked');
  const [trap, setTrap] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const fileManager = useFileManager();

  const log: TLog = useLog();
  const logDispatch = useLogDispatch();
  const eventCreator = useEventCreator();

  const assignmentDispatch = useAssignmentDispatch();

  const onSubmit = () => {
    const endgameEvent: TEvent = eventCreator.createEndgame(
      endgameLocation,
      `\"${notes}\"`,
      harmony === 'checked',
      trap,
      spotlit === 'checked'
    );
    logDispatch({
      type: ELogActionType.addEvent,
      event: endgameEvent,
    });

    assignmentDispatch({
      type: EAssignmentActionType.nextMatch,
    });

    log.events.push(endgameEvent);
    fileManager.saveLog(log).then((path) => {
      navigation.navigate('QRShow', { routeName: 'Prematch', path });
    });
  };

  return (
    <Box style={styles.autoContainer}>
      <Text variant="h4">Endgame</Text>
      <VStack>
        <Text variant="h6">Stage:</Text>
        <RadioButtonList
          labels={Object.values(EEndgameLocation)}
          direction="row"
          selected={endgameLocation}
          setSelected={(value: EEndgameLocation) => {
            setEndgameLocation(value);
          }}
        />
        <Divider />
        <RadioButton.Item
          label="Spotlit"
          value="Spotlit"
          status={spotlit}
          onPress={() => {
            setSpotlit(spotlit === 'unchecked' ? 'checked' : 'unchecked');
          }}
        />
        <Divider />
        <RadioButton.Item
          label="Harmony"
          value="Harmony"
          status={harmony}
          onPress={() => {
            setHarmony(harmony === 'unchecked' ? 'checked' : 'unchecked');
          }}
        />
        <Divider />
        <HStack
          style={{ alignContent: 'center', alignItems: 'center', marginLeft: 13, marginRight: 10 }}
        >
          <Text>Trap</Text>
          <Spacer />
          <Button
            title={trap.toString()}
            compact
            variant="outlined"
            onPress={() => {
              let newTrap: number = trap + 1;
              if (newTrap >= 4) newTrap = 0;
              setTrap(newTrap);
            }}
          />
        </HStack>
        <Divider />
        <TextInput
          label="Notes"
          variant="outlined"
          multiline={true}
          numberOfLines={20}
          textAlignVertical={'top'}
          style={styles.textInput}
          onChangeText={setNotes}
          value={notes}
        />
      </VStack>

      <HStack>
        <Button
          title="Submit"
          compact
          variant="contained"
          onPress={onSubmit}
          style={styles.button}
        />
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  autoContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: windowDimensions.height,
    width: windowDimensions.width,
  },
  button: {
    margin: 20,
    width: 100,
  },
  textInput: {
    height: 180,
    margin: 4,
    width: 400,
  },
});
