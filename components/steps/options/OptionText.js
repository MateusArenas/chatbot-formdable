import React from 'react';
import { Text } from 'react-native';

const OptionElement = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: props.fontColor,
          fontSize: 14,
          fontWeight: '500', 
          opacity: .8
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;



