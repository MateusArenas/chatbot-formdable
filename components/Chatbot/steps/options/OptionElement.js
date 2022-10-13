import React from 'react';
import { View } from 'react-native';

const OptionElement = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor: '#fafafa' || props.bubbleColor,
          borderWidth: 1, borderColor: 'rgba(0,0,0,.05)',
          paddingTop: 12,
          paddingRight: 18,
          paddingBottom: 12,
          paddingLeft: 18,
          borderRadius: 22,
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.10,
          // shadowRadius: 4.41,
          // elevation: 2,
        },
        props?.style
      ]}
    />
  );
}

export default OptionElement;


