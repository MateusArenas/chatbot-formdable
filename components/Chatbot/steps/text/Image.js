import React from 'react';
import { Image } from 'react-native';

const Img = (props) => {
  return (
    <Image {...props} 
      style={[
        {
          height: 40,
          width: 40,
          borderRadius: 21,
        },
        props?.style
      ]}
    />
  );
}

export default Img;



