import React from 'react';
import { TouchableOpacity } from 'react-native';

const Option = (props) => {
  return (
    <TouchableOpacity {...props} 
      style={[
        {
          marginTop: 2,
          marginRight: 2,
          marginBottom: 2,
          marginLeft: 2,
        },
        props?.style
      ]}
    />
  );
}

export default Option;

