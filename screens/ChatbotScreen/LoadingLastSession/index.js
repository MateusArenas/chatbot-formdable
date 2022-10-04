import React from 'react';

const STORAGE_CHATBOT_KEY = "RCA_CHATBOT-1.2.8";
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function setLastSession ({ step, overwrite }) {
  if (step?.value || overwrite) {
    const storageValue = await AsyncStorage.getItem(STORAGE_CHATBOT_KEY);
      let defaultData = {};
      if (storageValue) defaultData = JSON.parse(storageValue);

      await AsyncStorage.setItem(STORAGE_CHATBOT_KEY, JSON.stringify({
        lastTrigger: step?.trigger,
        overwrite: { 
          ...defaultData?.overwrite,
          ...overwrite,  
          [step?.id]: step?.value,
        }
      }))
  }
}

const LoadingLastSession = props => {
  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_CHATBOT_KEY).then(storageValue => {
      if (storageValue) {
        let defaultData = JSON.parse(storageValue);

        props.triggerNextStep({ 
          value: true,
          defaultTrigger: '7',
          overwrite: {
            ...defaultData.overwrite,
            ['lastTrigger']: defaultData.lastTrigger
          },
          // trigger: defaultData.lastTrigger
          trigger: 'reload-last-session-message'
        });
      } else {
        props.triggerNextStep({ value: false, trigger: 'initialize' });
      }
    });
  }, [])

  return null;
}

export default React.memo(LoadingLastSession);