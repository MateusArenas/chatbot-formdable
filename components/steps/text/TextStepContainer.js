import React from 'react';
import { View, Animated } from 'react-native';

const TextStepContainer = (props) => {
  return (
    <Animated.View {...props} 
      style={[
        {
          display: 'flex',
          flexDirection: props.user ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          width: '100%'
        },
        props.style
      ]}
    />
  );
}

export default TextStepContainer;
