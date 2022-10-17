import React from 'react';
import { Animated, View } from 'react-native';

const ChatStepContainer = (props) => {
  
  return (
    <Animated.View {...props} 
      style={[
        {
          display: 'flex',
          flexDirection: props.user ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          width: '100%',          
        },
        props?.style
      ]}
    />
  );
}

export default React.memo(ChatStepContainer);
