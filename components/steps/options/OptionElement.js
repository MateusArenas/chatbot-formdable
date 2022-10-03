import React from 'react';
import { View } from 'react-native';

const OptionElement = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor:'#f7f6f6' || props.bubbleColor, opacity: .8,
          paddingTop: 14,
          paddingRight: 16,
          paddingBottom: 14,
          paddingLeft: 16,
          borderRadius: 22,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;


