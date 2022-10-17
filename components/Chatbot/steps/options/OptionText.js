import React from 'react';
import { Text } from 'react-native';

const OptionElement = (props) => {
  return (
    <Text {...props} 
      style={[
        {
          color: "#0076fa" || props.fontColor,
          fontSize: 14,
          fontWeight: '500', 
        },
        props?.style,
        props?.primary && {
          color: "white",
        }
      ]}
    />
  );
}

export default OptionElement;



