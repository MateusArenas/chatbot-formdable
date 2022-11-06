import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

const InputSuggestions = ({ suggestions, value, onChangeSuggestion }) => {
  return (
    <ScrollView style={[
      { 
        position: "absolute", 
        width: '100%', 
        zIndex: 99, 
        bottom: "100%", left: 0, right: 0,
        maxHeight: 144,
        backgroundColor: "white",
        borderTopWidth: 1, borderColor: "rgba(0,0,0,.1)"
      }
    ]}>
      {suggestions
      ?.filter(suggestion => 
        (suggestion.match(new RegExp(value, "ig")) && suggestion !== value)
      )?.map?.(suggestion => (
        <Pressable key={suggestion} style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          { width: "100%", padding: 16, borderBottomWidth: 1, borderColor: "rgba(0,0,0,.1)" }
        ]}
          onPress={() => onChangeSuggestion(suggestion)}
        >
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{suggestion}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

export default InputSuggestions;