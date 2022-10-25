import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

const InputView = (props) => {
  return (
    <KeyboardAvoidingView {...props} 
      style={[{
        position: 'relative'
      },
        props?.style
      ]}
    />
  );
}

export default InputView;
