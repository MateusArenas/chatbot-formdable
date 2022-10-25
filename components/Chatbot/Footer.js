import React from 'react';
import { View } from 'react-native';

const Footer = (props) => {
  return (
    <View {...props} 
      style={[
        {
          borderTopWidth: 1,
          borderColor: props.disabled && !props?.invalid ? 'transparent' : props?.invalid ? '#E53935' : props?.color,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderTopWidth: 1, borderColor: 'rgba(0,0,0,.05)',
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.10,
          // shadowRadius: 4.41,
          // elevation: 2,
        },
        props?.style,
        { position: 'relative' }
      ]}
    />
  );
}

export default Footer;

