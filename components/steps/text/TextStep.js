import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Loading from '../common/Loading';
import Bubble from './Bubble';
import Img from './Image';
import ImageContainer from './ImageContainer';
import TextMessage from './TextMessage';
import TextStepContainer from './TextStepContainer';

const TextStep = props => {
  /* istanbul ignore next */
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const { step } = props;
    const { component, delay, waitAction } = step;
    const isComponentWatingUser = component && waitAction;
    setTimeout(() => {
      setLoading(false);
      if (!isComponentWatingUser) {
        props.triggerNextStep();
      }
    }, delay);
  }, [])

  const renderMessage = () => {
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

    message = message?.replace?.(/{previousValue}/g, previousValue) || "";

    return message;
  }

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
    } = props;
    const {
      avatar,
      bubbleColor,
      fontColor,
      user,
    } = step;

    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar;

    return (
      <TextStepContainer
        className="rsc-ts"
        user={user}
      >
        {
          isFirst && showAvatar &&
          <ImageContainer
            className="rsc-ts-image-container"
            borderColor={bubbleColor}
            style={avatarWrapperStyle}
            user={user}
          >
            <Img
              className="rsc-ts-image"
              style={avatarStyle}
              showAvatar={showAvatar}
              user={user}
              source={{ uri: avatar }}
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
          { loading && <Loading color={fontColor} /> }
          {
            !loading &&
            <TextMessage
              className="rsc-ts-text"
              fontColor={fontColor}
            >
              {renderMessage()}
            </TextMessage>
          }
        </Bubble>
      </TextStepContainer>
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

export default TextStep;
