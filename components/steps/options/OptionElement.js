import React from 'react';
import { View } from 'react-native';

const OptionElement = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor: props.bubbleColor,
          paddingTop: 12,
          paddingRight: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          borderRadius: 22,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;


