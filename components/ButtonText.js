import React from 'react';
import { Text } from 'react-native';

const Button = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: props.invalid ? '#FFF' : props.fontColor
        },
        props.style
      ]}
    />
  );
}

export default Button;
