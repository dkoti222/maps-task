import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Maps from './Maps';
import Screen4 from './Screen4';
import Chat from './Chat';


const Stack = createStackNavigator();

export class Navigation extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Chat" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
          <Stack.Screen name="Screen3" component={Screen3} />
          <Stack.Screen name="Screen4" component={Screen4} />
          <Stack.Screen name="Chat" component={Chat} />
          
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default Navigation