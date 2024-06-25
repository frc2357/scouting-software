import React from 'react';
import { Animated, Easing, Image, View, StyleSheet } from 'react-native';

export const LoadingSymbol: React.FC = () => {
  const spinValue = new Animated.Value(0);

  // First set up animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.view}>
      <Animated.Image
        style={{ transform: [{ rotate: spin }], ...styles.gear }}
        source={require('../../../assets/gear.png')}
      />
      <Image style={styles.radioactiveSymbol} source={require('../../../assets/radioactive.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  gear: {
    height: 200,
    position: 'absolute',
    width: 200,
  },
  radioactiveSymbol: {
    height: 140,
    margin: 0,
    padding: 0,
    position: 'relative',
    width: 140,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
  },
});
