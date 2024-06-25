import React, { useState } from 'react';
import { Box, Button, Divider, HStack, IconButton, Text } from '@react-native-material/core';
import { TFileManager, TLogStructure, TMatchLogsProps } from '../../../types';
import { useFileManager } from '../../hooks/useFileManager';
import { List } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingWrapper } from '../loadingScreens/LoadingWrapper';
import { ScrollView } from 'react-native';

export const MatchLogs: React.FC<TMatchLogsProps> = ({
  navigation,
}: TMatchLogsProps): React.ReactNode => {
  const [logStructure, setLogStructure] = useState<TLogStructure>({});
  const [isLoading, setIsLoading] = useState(true);
  const fileManager: TFileManager = useFileManager();

  useFocusEffect(
    React.useCallback((): void => {
      setIsLoading(true);
      fileManager
        .getLogStructure()
        .then((value: TLogStructure): void => {
          setLogStructure(value);
          setIsLoading(false);
        })
        .catch((err: any): void => {
          console.log('ERROR');
          console.log(JSON.stringify(err, null, 1));
          setIsLoading(false);
        });
    }, [])
  );

  const createLogButton: (path: string, deleteFile: () => void) => React.ReactNode = (
    path: string,
    deleteFile: () => void
  ): React.ReactNode => {
    return (
      <HStack spacing={50}>
        <IconButton
          icon={(): React.ReactElement => <List.Icon color="red" icon="delete" />}
          onPress={deleteFile}
        />
        <IconButton
          icon={(): React.ReactElement => <List.Icon icon="export" />}
          onPress={(): void => {
            navigation.navigate('QRShow', { routeName: 'MatchLogs', path: path });
          }}
        />
      </HStack>
    );
  };

  const createEventList: () => React.ReactNode = (): React.ReactNode => {
    const events: React.ReactNode[] = [];
    for (const eventName in logStructure) {
      events.push(
        <List.Accordion title={eventName} id={eventName} key={eventName}>
          {logStructure[eventName].map((matchLog, index) => {
            return (
              <List.Item
                key={matchLog.name}
                title={matchLog.name}
                right={() =>
                  createLogButton(matchLog.path, () => {
                    fileManager.deleteFile(matchLog.path);
                    logStructure[eventName].splice(index, 1);
                    setLogStructure({ ...logStructure });
                  })
                }
              />
            );
          })}
        </List.Accordion>
      );
    }

    return <List.AccordionGroup>{events}</List.AccordionGroup>;
  };

  return (
    <LoadingWrapper isLoading={isLoading} message="Loading Logs">
      <Box style={{ margin: 10 }}>
        <HStack spacing={50}>
          <Button
            title="Back"
            style={{ height: 38, width: 200 }}
            variant="contained"
            onPress={(): void => {
              navigation.navigate('Startup');
            }}
          />
          <Text variant="h4">Match Logs</Text>
        </HStack>
        <Divider style={{ marginBottom: 10 }} />
        <ScrollView>{createEventList()}</ScrollView>
      </Box>
    </LoadingWrapper>
  );
};
