import React from 'react';
import { View } from 'react-native';

const OptionElement = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor:'#f7f6f6' || props.bubbleColor,
          paddingTop: 14,
          paddingRight: 16,
          paddingBottom: 14,
          paddingLeft: 16,
          borderRadius: 22,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.10,
          shadowRadius: 4.41,
          elevation: 2,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;


