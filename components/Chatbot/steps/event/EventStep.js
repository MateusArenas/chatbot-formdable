import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Loading from '../common/Loading';
import EventStepContainer from './EventStepContainer';

import { Animated, Easing, SafeAreaView, View } from 'react-native';

const EventStep = props => {
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    const { waitAction } = props.step;
    if (typeof waitAction === "object") {
      const { text, delay } = waitAction;
  
      if (Array.isArray(text)) {
  
        const interval= setInterval(() => {
          setStage(stage => stage < (text.length-1) ? (stage+1) : 0)
        }, delay || 20)
  
        return () => clearInterval(interval)
      }
    }
  }, [props])

  React.useEffect(() => {
    const { delay } = props;
    const { waitAction } = props.step;
    const timeout = setTimeout(() => {
      if (!waitAction) {
        props.triggerNextStep();
      }
    }, delay);

    return () => clearTimeout(timeout)
  }, [props]);

  const pushAnim = React.useRef(new Animated.Value(-180)).current;
  const [contentSizeY, setContentSizeY] = React.useState(0);

  React.useEffect(() => {
    if (contentSizeY) {
      pushAnim.setValue(-(contentSizeY*2));
      Animated.timing(
        pushAnim,
        {
          toValue: 0,
          duration: props?.step.delay/2 || 200,
          useNativeDriver: false,
          easing: Easing.quad 
        }
      ).start();
    }
  }, [pushAnim, contentSizeY])

    const handleEvent = props => {
        const { step, steps, previousStep, triggerNextStep } = props;
        const { event } = step;
        return event({
            step,
            steps,
            previousStep,
            triggerNextStep,
        });
    }

    React.useEffect(() => {
      handleEvent(props)
    }, []);

    return (
      <EventStepContainer 
        onLayout={e => {
          !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
        }} 
        className="rsc-cs"
        style={[props?.style, { bottom: pushAnim }]}
      >
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
          <View style={{
              backgroundColor: '#f9f9f9',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#f9f9f9',
              paddingTop: 16,
              paddingRight: 22,
              paddingBottom: 16,
              paddingLeft: 22,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.10,
              shadowRadius: 4.41,
              elevation: 2,
          }}>
            <Loading children={props?.step?.waitAction?.text?.[stage]}
                color={props?.step?.loadingColor}
                custom={true}
            />
          </View>
        </View>
      </EventStepContainer>
    );
}

export default React.memo(EventStep);
