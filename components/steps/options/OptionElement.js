import React from 'react';
import { View } from 'react-native';

const OptionElement = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor:'#f7f6f6' || props.bubbleColor, opacity: .8,
          paddingTop: 12,
          paddingRight: 16,
          paddingBottom: 12,
          paddingLeft: 16,
          borderRadius: 22,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;


