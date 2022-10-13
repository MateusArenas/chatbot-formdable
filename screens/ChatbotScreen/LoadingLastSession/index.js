import React from 'react';

const STORAGE_CHATBOT_KEY = "RCA_CHATBOT-1.9.2";
export const RELOAD_LAST_SESSION_KEY = 'reload-last-session-message';
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function clearLastSession () {
  await AsyncStorage.removeItem(STORAGE_CHATBOT_KEY)
}

export async function setLastSession ({ step, overwrite: newOverwrite }) {
  if (step?.value || newOverwrite) {
    const storageValue = await AsyncStorage.getItem(STORAGE_CHATBOT_KEY);
      let defaultData = {};
      if (storageValue) defaultData = JSON.parse(storageValue);

      const { overwrite, lastTrigger } = defaultData;

      await AsyncStorage.setItem(STORAGE_CHATBOT_KEY, JSON.stringify({
        lastTrigger: step?.trigger === RELOAD_LAST_SESSION_KEY ? lastTrigger : step?.trigger,
        overwrite: { 
          ...overwrite,
          ...newOverwrite,  
          [step?.id]: step?.value,
        }
      }))
  }
}

const asyncLoadingLastSession = async props => {
    const storageValue = await AsyncStorage.getItem(STORAGE_CHATBOT_KEY);

    if (storageValue) {
      const defaultData = JSON.parse(storageValue);

      const { overwrite, lastTrigger } = defaultData;

      props.triggerNextStep({ 
        defaultTrigger: '7',
        overwrite: {
          ...overwrite,
          ['lastTrigger']: lastTrigger
        },
        trigger: RELOAD_LAST_SESSION_KEY
      });
    } else {

      props.triggerNextStep({});

    }
}

export default asyncLoadingLastSession;