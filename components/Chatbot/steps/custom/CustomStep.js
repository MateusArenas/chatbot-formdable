import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

import Loading from '../common/Loading';
import CustomStepContainer from './CustomStepContainer';

const CustomStep = props => {
  const [loading, setLoading] = React.useState(true);
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
      setLoading(false);
      if (!waitAction) {
        props.triggerNextStep();
      }
    }, delay);

    return () => clearTimeout(timeout)
  }, [props]);

  const pushAnim = React.useRef(new Animated.Value(-180)).current;
  const [contentSizeY, setContentSizeY] = React.useState(0);

  React.useEffect(() => {
    if (contentSizeY && loading) {
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
  }, [pushAnim, contentSizeY, loading])


  const loadingComponent = (
    <Loading children={props?.step?.waitAction?.text?.[stage]}
      color={props?.step?.loadingColor}
      custom={true}
    />
  )

    return (
      <CustomStepContainer 
        onLayout={e => {
          !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
        }} 
        className="rsc-cs"
        style={[props?.style, (props?.step?.metadata?.hide) && { 
          backgroundColor: 'transparent', borderColor: 'transparent',
          display: loading ? 'flex' : 'none'
        },
        { bottom: pushAnim }
        ]}
      >
        {
          (loading) ? loadingComponent : (
            <RenderComponent {...props} 
              action={props?.step?.metadata?.action}
              loadingComponent={loadingComponent}
            />
          )
        }
      </CustomStepContainer>
    );
}

export default React.memo(CustomStep);


const RenderComponent = React.memo(props => {
  const { step, steps, previousStep, triggerNextStep, loadingComponent } = props;
  const { component } = step;

  return React.cloneElement(component, {
    step,
    steps,
    previousStep,
    triggerNextStep,
    loadingComponent
  });
})