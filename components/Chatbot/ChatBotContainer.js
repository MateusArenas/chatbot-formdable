import React from 'react';
import { View } from 'react-native';

const ChatBotContainer = (props) => {
  return (
    <View {...props} 
      style={[
        {
          backgroundColor: '#f5f8fb',
          overflow: 'hidden',
          height: '100%',
          width: '100%',
        },
        props.style
      ]}
    />
  );
}

export default ChatBotContainer;

