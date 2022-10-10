import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Path } from "react-native-svg"

const Radiobox = (props) => {
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
            d="M12 20a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8m0-18A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 5a5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5 5 5 0 00-5-5z"
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
        d="M12 20a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8m0-18A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z"
      />
    </Svg>
  )
}


Radiobox.propTypes = {
  marked: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Radiobox;