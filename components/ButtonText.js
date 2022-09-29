import React from 'react';
import { Text } from 'react-native';

const Button = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: props.invalid ? '#FFF' : props.fontColor,
          fontSize: 16
        },
        props.style
      ]}
    />
  );
}

export default Button;
