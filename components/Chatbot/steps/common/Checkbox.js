import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Path } from "react-native-svg"

const Checkbox = (props) => {
  const defaultStyle = {
    width: props?.size || 24,
    height: props?.size || 24,
    color: props?.color || 'black'
  }

  if (props?.marked) {
    return (
        <Svg viewBox="0 0 24 24"
          style={[defaultStyle, props?.style]}
          {...props}
        >
          <Path
            fill="currentColor"
            d="M10 17l-5-5 1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
          />
        </Svg>
    )
  }

  return (
    <Svg viewBox="0 0 24 24"
      {...props}
      style={[defaultStyle, props?.style]}
    >
      <Path
        fill="currentColor"
        d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2m0 2v14H5V5h14z"
      />
    </Svg>
  )
}


Checkbox.propTypes = {
  marked: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Checkbox;