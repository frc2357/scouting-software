import { Stack, HStack } from '@react-native-material/core';
import React from 'react';
import { RadioButton } from 'react-native-paper';
import { TRadioButtonListProps } from '../../../types';

export const RadioButtonList: React.FC<TRadioButtonListProps> = ({
  labels,
  direction = 'column',
  position = 'trailing',
  selected,
  setSelected,
}: TRadioButtonListProps) => {
  return (
    <RadioButton.Group onValueChange={(newValue) => setSelected(newValue)} value={selected}>
      <Stack direction={direction}>
        {labels.map((label, i) => {
          return (
            <HStack key={label}>
              <RadioButton.Item label={label} value={label} position={position} />
            </HStack>
          );
        })}
      </Stack>
    </RadioButton.Group>
  );
};
