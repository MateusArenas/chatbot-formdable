import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Option from './Option';
import OptionElement from './OptionElement';
import Options from './Options';
import OptionText from './OptionText';

import { Animated, Easing } from 'react-native'; 

const OptionsStep = props => {
  /* istanbul ignore next */

  const onOptionClick = ({ value }) => {
    props.triggerNextStep({ value });
  }

  const { options } = props.step;

  return (
    <Options className="rsc-os">
      {options?.map((option, index) => (
        <RenderOption key={index} {...props}
          option={option}
          onOptionClick={onOptionClick}
        />
      ))}
    </Options>
  );
}

OptionsStep.propTypes = {
  step: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
  optionStyle: PropTypes.object.isRequired,
  optionElementStyle: PropTypes.object.isRequired,
};

export default  React.memo(OptionsStep);

const RenderOption = React.memo(({ option, onOptionClick, ...props }) => {
  const { optionStyle, optionElementStyle } = props;
  const { optionBubbleColor, optionFontColor, bubbleColor, fontColor } = props.step;
  const { value, label } = option;

  const pushAnim = React.useRef(new Animated.Value(-180)).current
  const [contentSizeY, setContentSizeY] = React.useState(0);

  React.useEffect(() => {
    if (contentSizeY) {
      pushAnim.setValue(-(contentSizeY*2));
      Animated.timing(
        pushAnim,
        {
          toValue: 0,
          duration: props?.step?.delay/2 || 400,
          useNativeDriver: false,
          easing: Easing.quad 
        }
      ).start();
    }
  }, [pushAnim, contentSizeY])

  return (
    <Option style={[optionStyle, { bottom: pushAnim }]}
      onLayout={e => {
        !contentSizeY && setContentSizeY(e.nativeEvent.layout.height)
      }} 
      className="rsc-os-option"
      onPress={() => onOptionClick({ value })}
    >
      <OptionElement
        className="rsc-os-option-element"
        style={optionElementStyle}
        bubbleColor={optionBubbleColor || bubbleColor}
      >
        <OptionText
          class="rsc-os-option-text"
          fontColor={optionFontColor || fontColor}
        >
          {label}
        </OptionText>
      </OptionElement>
    </Option>
  );
})