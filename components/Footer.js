import React from 'react';
import { View } from 'react-native';

const Footer = (props) => {
  return (
    <View {...props} 
      style={[
        {
          borderTopWidth: 1,
          borderColor: props.disabled && !props?.invalid ? '#ddd' : props?.invalid ? '#E53935' : props?.color,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        props?.style
      ]}
    />
  );
}

export default Footer;

