import React from 'react';
import { View, Animated } from 'react-native';

const ChatStepContainer = (props) => {
  
  return (
    <Animated.View {...props} 
      style={[
        {
          marginRight: 6,
          marginBottom: 24,
          marginTop: 14,
          marginLeft: 6,
        },
        props?.style
      ]}
    />
  );
}

export default React.memo(ChatStepContainer);
