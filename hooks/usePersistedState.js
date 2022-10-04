import { useEffect, useState,Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

function usePersistedState(key, initialState) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      
      const storageValue = await AsyncStorage.getItem(key);
      
      if (storageValue) {
        const parseV = JSON.parse(storageValue);

        if(Array.isArray(initialState) && !Array.isArray(parseV)) {
          setState(Object.values(parseV));
        } else {
          setState(parseV);
        }
      } else {
        setState(initialState);
      }
    })()
  }, [key])

  useEffect(() => {
    (async () => {
      try {
      await AsyncStorage.setItem(key, JSON.stringify(state))
      
      } catch (err) {
        console.log(err);
      }
    })()
  }, [state])

  
  return [state, setState]
}

export default usePersistedState