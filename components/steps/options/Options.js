import React from 'react';
import { View } from 'react-native';

const Options = (props) => {
  return (
    <View {...props} 
      style={[
        {
          paddingRight: 4,
          paddingLeft: 4,
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


