import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Loading from '../common/Loading';
import EventStepContainer from './EventStepContainer';

import { Animated, Easing } from 'react-native';

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

    React.useEffect(() => handleEvent(props), []);

    return (
      <EventStepContainer 
        onLayout={e => {
          !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
        }} 
        className="rsc-cs"
        style={[props?.style, { bottom: pushAnim }]}
      >
        <Loading children={props?.step?.waitAction?.text?.[stage]}
            color={props?.step?.loadingColor}
            custom={true}
        />
      </EventStepContainer>
    );
}

export default React.memo(EventStep);


const RenderComponent = React.memo(props => {
  const { step, steps, previousStep, triggerNextStep } = props;
  const { component } = step;
  return React.cloneElement(component, {
    step,
    steps,
    previousStep,
    triggerNextStep,
  });
})