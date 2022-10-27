import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';

import Loading from '../common/Loading';
import Bubble from '../text/Bubble';
import Img from '../text/Image';
import ImageContainer from '../text/ImageContainer';
import EventStepContainer from './EventStepContainer';

const defaultBotAvatar = require('../common/images/avatar-horiz.png');

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
      const { delay } = props;

      const timeout = setTimeout(() => {
        handleEvent(props)
      }, delay);

      return () => clearTimeout(timeout)
    }, [props]);


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


    const [loadImage, setLoadImage] = React.useState(false);
    const scaleAnim = React.useRef(new Animated.Value(0)).current

    React.useEffect(() => {
      if (loadImage) {
        Animated.timing(
          scaleAnim,
          {
            toValue: 1,
            duration: step.delay/2,
            useNativeDriver: false,
            easing: Easing.cubic 
          }
        ).start();
      }
    }, [loadImage, scaleAnim])

    const lastStepBotId = [...props?.renderedSteps]?.reverse().find(step => 
      ( !step?.user && (step?.message || step?.asMessage || step?.event) )
    )?.id;


    return (
      <EventStepContainer 
        onLayout={e => {
          !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
        }} 
        className="rsc-cs"
        style={[props?.style, { bottom: pushAnim }]}
      >
      {
              (
                lastStepBotId === step.id 
                && showAvatar
              ) &&
              <ImageContainer 
                className="rsc-ts-image-container"
                borderColor={bubbleColor}
                style={[avatarWrapperStyle, 
                { opacity: scaleAnim, transform: [{ scale: scaleAnim }] },  
                { 
                  alignSelf: 'center', bottom: 0, backgroundColor: '#0077ff', 
                  position: 'absolute',
                }, 
                ]}
                user={user}
              >
                <Img onLoadEnd={() => setLoadImage(true)}
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
            <Loading children={props?.step?.waitAction?.text?.[stage]}
                color={props?.step?.loadingColor}
                custom={true}
            />
          </Bubble>
      </EventStepContainer>
    );
}

export default React.memo(EventStep);
