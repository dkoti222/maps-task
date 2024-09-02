import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalTouchableOpacity from './GlobalTouchableOpacity';
import { PanGestureHandler } from 'react-native-gesture-handler';
// import { Animated } from 'react-native-maps';
import Animated, {Extrapolate,interpolate,useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
 withSpring
} from 'react-native-reanimated';
import { Image } from 'react-native-animatable';



const Maps = ({navigation}) => {
  const handleButton1Press = () => {navigation.navigate('Screen3')};
  const handleButton2Press = () => {navigation.navigate('Screen1') };
  const handleButton3Press = () => {navigation.navigate('Screen2')};



  const handleButton4Press = () => {
    navigation.navigate('Screen4')
   
  
  };
 
   const X = useSharedValue(10)
   const boxValue=useSharedValue(0)


  const AnimatedGestureHandler = useAnimatedGestureHandler({
    onActive: e => {
     X.value=e.translationX
    },
    onEnd: () => {
      if (X.value > 150) {
        X.value = withSpring(230);
      } else {
        X.value = withSpring(10);
      }
    },
  });

  const animatedStyle=useAnimatedStyle(()=>{
    return{transform:[{translateX:X.value}]}
  })

  const textStyle=useAnimatedStyle(()=>{
    return{
      opacity:interpolate(X.value,[0,150],[0.8,0],Extrapolate.CLAMP),
      transform:[{translateX:interpolate(X.value,[0,150],[0,200,Extrapolate.CLAMP])}]
    }
  })
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <GlobalTouchableOpacity name="Current Location" onPress={handleButton1Press}  />
      <GlobalTouchableOpacity name="Markers" onPress={handleButton2Press} />
      <GlobalTouchableOpacity name="Polygon" onPress={handleButton3Press} />
      <GlobalTouchableOpacity name="Take Picture" onPress={handleButton4Press} />



   
    {/* <View style={{height:50,width:300,backgroundColor:'#1E5B70',borderRadius:10,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center'}}>
      <PanGestureHandler onGestureEvent={AnimatedGestureHandler}>
      <Animated.View  style={[{height:50,width:50,position:'absolute',left:0,backgroundColor:'red',borderRadius:10,justifyContent:'center',alignItems:'center'},animatedStyle]}> 
      <Image source={require('../src/bike.png')}  style={{height:30,width:30}}/>
       </Animated.View>
      </PanGestureHandler>
      <Animated.Text style={textStyle}> {'>> swipe here'}</Animated.Text>
    </View>
      */}

    </View>
  );
};

export default Maps;
