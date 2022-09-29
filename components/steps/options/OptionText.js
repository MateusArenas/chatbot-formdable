import React from 'react';
import { Text } from 'react-native';

const OptionElement = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: props.fontColor,
          fontSize: 14,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;



