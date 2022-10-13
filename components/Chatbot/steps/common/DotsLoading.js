import * as React from "react"
import { Animated, Easing, View } from "react-native"
import Svg, { Circle, Path } from "react-native-svg"

const AnimatedCircle  = Animated.createAnimatedComponent(Circle);

function DotsLoading ({ color="#272527", size="" }) {

  return (
    <View 
      style={{ 
        transform: [{ scale: 1 }],
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
        width: 50,  opacity: .5,
        // backgroundColor: 'red'
        // alignSelf: 'center', marginTop: 100 
      }}
    >
      {[0,0,0].map((_, index) => (
        <DotLoading key={index} color={color} delay={120*(index+1)}/>
      ))}
    </View>
  )
}


const DotLoading = ({ delay=100, color="black", ...props}) => {
  
  const circleRadius = React.useRef(new Animated.Value(0)).current
  const circleRef = React.useRef(null);

  React.useEffect(() => {
    const listener =  circleRadius?.addListener?.( (circleRadius) => {
      circleRef?.current?.setNativeProps?.({ r: circleRadius.value.toString(), opacity: circleRadius.value/3 });
    });

    return () => circleRadius.removeListener(listener);
  }, [circleRadius, circleRef])
  
  React.useEffect(() => {
    const interval = setInterval( () => {
      Animated?.spring?.(circleRadius, { 
        toValue: 3, 
        friction: 3,
        useNativeDriver: false 
      } ).start(() => circleRadius?.setValue?.(0));
    }, 400+delay)

    return () => clearInterval(interval);
  }, [circleRadius])

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
