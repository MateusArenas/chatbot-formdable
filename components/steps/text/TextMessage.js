import React from 'react';
import { Text } from 'react-native';

const TextMessage = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: props.fontColor,
          fontSize: 16,
          fontWeight: '500',
        },
        props?.style
      ]}
    />
  );
}

export default TextMessage;



