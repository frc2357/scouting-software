import React from 'react';
import { Pressable } from '@react-native-material/core';
import { Image } from 'react-native';
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { TGamepieceButtonProps } from '../../../types';

export const GamepieceButton: React.FC<TGamepieceButtonProps> = ({
  gamePieceSrc,
  isHidden,
  setHidden,
  style = {},
  imageStyle,
}) => {
  const renderImage = () => {
    return isHidden ? (
      <></>
    ) : (
      // eslint-disable-next-line react-native/no-inline-styles
      <Image
        source={gamePieceSrc}
        style={
          { ...(imageStyle || { ...style, position: 'relative', top: 0, left: 0 }) } as ImageStyle
        }
      />
    );
  };

  return (
    <Pressable
      onPress={() => {
        setHidden(false);
      }}
      onLongPress={() => {
        setHidden(true);
      }}
      pressEffect="none"
      // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
      style={{ ...style, backgroundColor: 'rgba(0,0,0,0)' }}
    >
      {renderImage()}
    </Pressable>
  );
};
