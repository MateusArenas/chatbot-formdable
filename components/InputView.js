import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

const InputView = (props) => {
  return (
    <KeyboardAvoidingView {...props} 
      style={[{},
        props?.style
      ]}
    />
  );
}

export default InputView;
