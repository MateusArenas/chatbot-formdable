import React from 'react';
import { View } from 'react-native';

const Options = (props) => {
  return (
    <View {...props} 
      style={[
        {
          paddingRight: 6,
          paddingLeft: 6,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        props?.style
      ]}
    />
  );
}

export default Options;


