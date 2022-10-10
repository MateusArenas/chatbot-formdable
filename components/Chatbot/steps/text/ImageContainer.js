import React from 'react';
import { View } from 'react-native';

const ImageContainer = (props) => {
  return (
    <View {...props} 
      style={[
        {
          marginTop: 6,
          marginRight: 6,
          marginBottom: 10,
          marginLeft: 6,
          width: 44, 
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // paddingTop: 2,
          // paddingRight: 2,
          // paddingBottom: 2,
          // paddingLeft: 2,

          backgroundColor: '#fff',
          // borderTopRightRadius: 21,
          // borderTopLeftRadius: 21,
          // borderBottomRightRadius: props.user ? 21 : 0,
          // borderBottomLeftRadius: props.user ? 0 : 21,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#ddd',
        },
        props?.style
      ]}
    />
  );
}

export default ImageContainer;



