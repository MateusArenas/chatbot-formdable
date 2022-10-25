import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity {...props} 
      style={[
        {
          // backgroundColor: props.disabled && !props.invalid ? '#ddd' : props.invalid ? '#E53935' : props.backgroundColor,
          
          // height: 50,
          // width: 80,
          position: 'absolute', right: 12,
          margin: 12, padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
        (props.disabled || props.invalid) && { opacity: .6 }
      ]}
    />
  );
}

export default Button;
