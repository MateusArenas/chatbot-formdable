import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing, Image, Text, TouchableWithoutFeedback } from 'react-native';

import Loading from '../common/Loading';
import Bubble from './Bubble';
import Img from './Image';
import ImageContainer from './ImageContainer';
import TextMessage from './TextMessage';
import TextStepContainer from './TextStepContainer';

const defaultBotAvatar = require('../common/images/avatar-horiz.png');

const TextStep = props => {
  /* istanbul ignore next */
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const { step } = props;
    const { component, delay, waitAction } = step;
    const isComponentWatingUser = component && waitAction;
    const timeout = setTimeout(() => {
      setLoading(false);
      if (!isComponentWatingUser) {
        props.triggerNextStep();
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [])

    const {
      step,
      isFirst,
      isLast,
      avatarStyle,
      avatarWrapperStyle,
      bubbleStyle,
      userBubbleStyle,
      hideBotAvatar,
      hideUserAvatar,
      steps,
    } = props;
    const {
      avatar,
      bubbleColor,
      fontColor,
      user,
    } = step;

    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar;

    const pushAnim = React.useRef(new Animated.Value(-180)).current
    const scaleAnim = React.useRef(new Animated.Value(0)).current
    const [contentSizeY, setContentSizeY] = React.useState(0.2);

    React.useEffect(() => {
      if (contentSizeY && loading) {
        pushAnim.setValue(-(contentSizeY*2));
        Animated.timing(
          pushAnim,
          {
            toValue: 0,
            duration: step.delay/2,
            useNativeDriver: false,
            easing: Easing.quad 
          }
        ).start();
      }
    }, [pushAnim, contentSizeY, loading])

    const [loadingIMG, setLoadingIMG] = React.useState(true);

    React.useEffect(() => {
      if (!loading && !loadingIMG) {
        Animated.timing(
          scaleAnim,
          {
            toValue: 1,
            duration: step.delay/2,
            useNativeDriver: false,
            easing: Easing.bounce 
          }
        ).start();
      }
    }, [scaleAnim, loading, loadingIMG])

    const lastStepBotId = Object.keys(steps).reverse().find(key => 
      (
        !steps?.[key]?.user && steps?.[key]?.message
      )
    );

    return (
      <>
        <TextStepContainer style={[
          { bottom: pushAnim }, 
          { position: 'relative', alignItems: 'center' }
        ]}
          onLayout={e => {
            !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
          }} 
          className="rsc-ts"
          user={user}
          >
            {
              (
                lastStepBotId === step.id 
                && showAvatar
              ) &&
              <ImageContainer
                className="rsc-ts-image-container"
                borderColor={bubbleColor}
                style={[
                  avatarWrapperStyle, 
                  { transform: [{ scale: scaleAnim }] },
                  { 
                    alignSelf: 'center', bottom: 0, backgroundColor: '#0077ff', 
                    borderWidth: 0, position: 'absolute',
                  }
                ]}
                user={user}
              >
                <Img onLoadEnd={() => setLoadingIMG(false)}
                  className="rsc-ts-image"
                  style={[avatarStyle, { transform: [{ scale: 1.25 }] }]}
                  showAvatar={showAvatar}
                  user={user}
                  source={defaultBotAvatar || { uri: avatar }}
                  alt="avatar"
                />
              </ImageContainer>
            }
          <Bubble
            className="rsc-ts-bubble"
            style={user ? userBubbleStyle || bubbleStyle :  bubbleStyle}
            user={user}
            bubbleColor={bubbleColor}
            showAvatar={showAvatar}
            isFirst={isFirst}
            isLast={isLast}
          >
              <TextMessage
                className="rsc-ts-text"
                fontColor={fontColor}
              >
                <RenderMessage {...props} />
              </TextMessage>
          </Bubble>
        </TextStepContainer>
      </>
    );
}

TextStep.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  step: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  avatarWrapperStyle: PropTypes.object,
  bubbleStyle: PropTypes.object.isRequired,
  userBubbleStyle: PropTypes.object.isRequired,
  hideBotAvatar: PropTypes.bool.isRequired,
  hideUserAvatar: PropTypes.bool.isRequired,
  previousStep: PropTypes.object,
  previousValue: PropTypes.any,
  steps: PropTypes.object,
};

TextStep.defaultProps = {
  previousStep: {},
  steps: {},
  previousValue: '',
  avatarWrapperStyle: {}
};

export default  React.memo(TextStep);


const RenderMessage = React.memo(props => {
  const { previousValue, step } = props;
  const { component } = step;
  let { message } = step;

  if (component) {
    const { steps, previousStep, triggerNextStep } = props;
    return React.cloneElement(component, {
      step,
      steps,
      previousStep,
      triggerNextStep,
    });
  }

  const links = message?.match?.(/{link:(.*?)}/);

  message = message?.replace?.(/{previousValue}/g, previousValue) || "";

  if (links?.length) {

    const [previous, lasteds] = message?.split?.(/{link:.*}/g);

    return (
      <Text>
        {previous}
        <TouchableWithoutFeedback onPress={() => step?.link?.(links?.[1])}>
          <Text style={{ color: "#0076fa" }}>{links?.[1]}</Text>
        </TouchableWithoutFeedback >
        {lasteds}
      </Text>
    );
  }

  return message;
})