import React from 'react';
import { Animated, View } from 'react-native';

const TextStepContainer = (props) => {
  return (
    <Animated.View {...props} 
      style={[
        {
          display: 'flex',
          flexDirection: props.user ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          width: '100%',
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.10,
          // shadowRadius: 4.41,
          // elevation: 2,
        },
        props.style
      ]}
    />
  );
}

export default TextStepContainer;
