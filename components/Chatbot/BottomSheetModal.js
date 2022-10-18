import React from 'react';
import { Animated, Dimensions, Modal, PanResponder, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const BottomSheetModal = props => {
  const panY = React.useRef(new Animated.Value(Dimensions.get('screen').height)).current;

  React.useEffect(() => {
    if (props?.visible) {
      resetPositionAnim.start();
    }

    return () => console.log("Clearup");
  }, [props?.visible])

  function handleDismiss() {
    closeAnim.start(() => props?.onDismiss());
  }

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  })

  const closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 500,
    useNativeDriver: false,
  })

  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const panResponders = React.useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderMove: Animated.event([
      null, {dy: panY}, 
    ], {useNativeDriver: false}),
    onPanResponderRelease: (e, gs) => {
      if (gs.dy > 0 && gs.vy > 2) {
        return closeAnim.start(() => props?.onDismiss());
      }
      return resetPositionAnim.start();
    },
  })).current;

  return (
    <Modal
      animated
      animationType="fade"
      visible={props?.visible}
      transparent
      onDismiss={props?.onDismiss}
      onRequestClose={() => handleDismiss()}>
        <TouchableWithoutFeedback onPress={() => handleDismiss()} >
          <View style={styles.overlay} >
            <Animated.View style={[styles.container, {top}]}  {...panResponders.panHandlers} >
              <View style={[
                { width: 50, height: 8, borderRadius: 10, alignSelf: 'center', margin: 12 },
                { position: 'absolute', backgroundColor: 'rgba(0,0,0,.1)' }
              ]}/>
              {props.children}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%', 
    backgroundColor: 'white',
    padding: 22,
    paddingTop: 32, 
    paddingBottom: 16,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: Dimensions.get('screen').height
  },
});

export default BottomSheetModal;