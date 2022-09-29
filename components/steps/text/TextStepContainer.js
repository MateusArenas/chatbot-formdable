import React from 'react';
import { View } from 'react-native';

const TextStepContainer = (props) => {
  return (
    <View {...props} 
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
