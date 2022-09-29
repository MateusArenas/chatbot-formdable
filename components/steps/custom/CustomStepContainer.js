import React from 'react';
import { View } from 'react-native';

const ChatStepContainer = (props) => {
  
  return (
    <View {...props} 
      style={[
        {
          backgroundColor: '#fff',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#ddd',
          marginRight: 6,
          marginBottom: 10,
          marginLeft: 6,
          paddingTop: 16,
          paddingRight: 16,
          paddingBottom: 16,
          paddingLeft: 16,
        },
        props?.style
      ]}
    />
  );
}

export default ChatStepContainer;
