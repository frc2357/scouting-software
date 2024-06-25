import { FlexStyle } from 'react-native/types';

export type TRadioButtonListProps = {
  labels: string[];
  direction?: FlexStyle['flexDirection'];
  position?: 'leading' | 'trailing';
  selected: string;
  setSelected: (value: string) => void;
};
