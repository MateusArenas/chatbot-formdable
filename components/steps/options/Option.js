import React from 'react';
import { TouchableOpacity } from 'react-native';

const Option = (props) => {
  return (
    <TouchableOpacity {...props} 
      style={[
        {
          marginTop: 4,
          marginRight: 4,
          marginBottom: 4,
          marginLeft: 4,
        },
        props?.style
      ]}
    />
  );
}

export default Option;

