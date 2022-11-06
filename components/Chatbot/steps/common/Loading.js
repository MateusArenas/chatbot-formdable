import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import Bubbles from './Bubbles';

const Loading = (props) => {
  const { custom, color } = props;
  let style = { paddingTop: 6 };

  if (custom) {
    style = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  return (
    <View style={style}>
      {/* <Bubbles
        size={3}
        color={color}
      /> */}

      <Bubbles />

      {/* {props?.children ? (
        <Text style={{ color, fontWeight: 'bold' }}>{props.children}</Text>
      ) : (
        <ActivityIndicator color="blue" />
      )} */}
    </View>
  );
};

Loading.propTypes = {
  color: PropTypes.string.isRequired,
  custom: PropTypes.bool,
};

Loading.defaultProps = {
  custom: false,
};

export default Loading;
