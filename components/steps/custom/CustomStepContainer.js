import React from 'react';
import { View, Animated } from 'react-native';

const ChatStepContainer = (props) => {
  
  return (
    <Animated.View {...props} 
      style={[
        {
          backgroundColor: '#f9f9f9',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#f9f9f9',
          marginRight: 6,
          marginBottom: 24,
          marginTop: 14,
          marginLeft: 6,
          paddingTop: 18,
          paddingRight: 16,
          paddingBottom: 18,
          paddingLeft: 16,
        },
        props?.style
      ]}
    />
  );
}

export default React.memo(ChatStepContainer);
