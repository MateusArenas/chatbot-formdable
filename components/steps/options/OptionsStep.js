import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Option from './Option';
import OptionElement from './OptionElement';
import Options from './Options';
import OptionText from './OptionText';

const OptionsStep = props => {
  /* istanbul ignore next */

  const onOptionClick = ({ value }) => {
    props.triggerNextStep({ value });
  }

  const renderOption = (option) => {
    const { optionStyle, optionElementStyle } = props;
    const { optionBubbleColor, optionFontColor, bubbleColor, fontColor } = props.step;
    const { value, label } = option;
    return (
      <Option
        key={value}
        className="rsc-os-option"
        style={optionStyle}
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
  }

  const { options } = props.step;

  return (
    <Options className="rsc-os">
      {_.map(options, renderOption)}
    </Options>
  );
}

OptionsStep.propTypes = {
  step: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
  optionStyle: PropTypes.object.isRequired,
  optionElementStyle: PropTypes.object.isRequired,
};

export default OptionsStep;
