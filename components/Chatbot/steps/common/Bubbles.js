import React, { Component, PropTypes } from 'react';
import { Animated, Easing, View } from "react-native"
import Svg, { Circle } from "react-native-svg"

const AnimatedCircle  = Animated.createAnimatedComponent(Circle);

const Bubbles = ({ size=8, color="#272822", spaceBetween=12, ...props }) => {
  const circles = [
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
  ];
  const refs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ];
  const [timers, setTimers] = React.useState([]);

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    circles.forEach((val, index) => {
        const timer = setTimeout(() => animate(index), index * 300);
        setTimers(timers => [...timers, timer]);
    });

    return () => {
        timers.forEach((timer) => {
            clearTimeout(timer);
        });
      
        isMountedRef.current = true;
    }
  }, []);

  React.useEffect(() => {
    const listeners = circles.map((circle, index) =>
      circle?.addListener?.((circleRadius) => {
        refs[index]?.current?.setNativeProps?.({ r: (circleRadius?.value*size)?.toString?.(), opacity: circleRadius?.value });
      })
    );

    return () => circles.map((circle, index) => circle.removeListener(listeners[index]));
  }, [circles, refs])

  function animate(index) {
    Animated
      .sequence([
        Animated.timing(circles[index], {
          toValue: 1,
          duration: 600,
          useNativeDriver: false 
        }),
        Animated.timing(circles[index], {
          toValue: 0,
          duration: 600,
          useNativeDriver: false 
        })
      ])
      .start((finished) => {
        if (!isMountedRef.current && finished) {
          animate(index);
        }
      });
  }

  function renderBubble(index) {
    const offset = {
      x: size + index * ((size * 2) + spaceBetween),
      y: size
    };

    return (
      <AnimatedCircle ref={refs[index]} 
         cx={size} cy={size} r={size} fill={color} opacity="1" 
         {...offset}
      />
    )
  }


  const width = ( size * 2) + spaceBetween * 2.5;
  const height = size * 2;

  return (
    <Svg 
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={width}
        height={height}
        viewBox={`0 0 ${(width*2)} ${height*2}`}
        {...props}
    >
        {renderBubble(0)}
        {renderBubble(1)}
        {renderBubble(2)}
      </Svg>
  );
}

export default Bubbles;

