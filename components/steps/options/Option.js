import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Option = (props) => {
  return (
    <AnimatedTouchable {...props} 
      style={[
        {
          marginTop: 4,
          marginRight: 4,
          marginBottom: 4,
          marginLeft: 4,
        },
        props?.style
      ]}
    />
  );
}

export default Option;

