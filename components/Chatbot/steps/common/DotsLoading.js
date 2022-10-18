import { func } from "prop-types";
import * as React from "react"
import { Animated, Easing, View } from "react-native"
import Svg, { Circle } from "react-native-svg"

const AnimatedCircle  = Animated.createAnimatedComponent(Circle);

function DotsLoading ({ color="#272527", size=3  }) {
  const [index, setIndex] = React.useState(0);

  return (
    <View 
      style={{ 
        transform: [{ scale: 1 }],
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
        width: 50,  opacity: .5,
      }}
    >
      {(new Array(size).fill(null)).map((_, i) => (
        <DotLoading key={i} color={color} init={i === index}
          onFinish={() => setIndex(index => (index < (size-1)) ? (index+1) : 0)}
        />
      ))}
    </View>
  )
}


const DotLoading = ({ delay=100, color="black", onFinish, init, ...props}) => {
  
  const circleRadius = React.useRef(new Animated.Value(0)).current
  const circleRef = React.useRef(null);

  React.useEffect(() => {
    const listener =  circleRadius?.addListener?.( (circleRadius) => {
      circleRef?.current?.setNativeProps?.({ r: circleRadius.value.toString(), opacity: circleRadius.value/3 });
    });

    return () => circleRadius.removeListener(listener);
  }, [circleRadius, circleRef])


  const bubblesSetAnimated = (value=0, callback) => {
    Animated?.timing?.(circleRadius, { 
      toValue: value, 
      duration: 400,
      delay: value ? 0 : 250,
      easing: Easing.elastic(1),
      useNativeDriver: false 
    } ).start(({ finished  }) => finished && callback?.());
  }
  
  React.useEffect(() => {
    // const interval = setInterval( () => {
      if (init) {
        bubblesSetAnimated(3, () => {
          onFinish()
          bubblesSetAnimated(0)
        });
      }
    // }, 600+delay)

    // return () => clearInterval(interval);
  }, [circleRadius, init])

  return (
    <Svg 
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="16px"
      height="16px"
      viewBox="0 0 12 12"
      {...props}
    >
      <AnimatedCircle ref={circleRef} cx="6" cy="6" r="3" fill={color} opacity="1" />
    </Svg>
  )
}

export default DotsLoading
