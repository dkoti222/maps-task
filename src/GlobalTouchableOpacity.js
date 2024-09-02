import React from 'react';
import { TouchableOpacity, Text, StyleSheet  } from 'react-native';


const GlobalTouchableOpacity = ({ name, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttontext}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#1E5B70',
    height:50,
    width:200
    
  },
  buttontext: {
    fontSize: 25,
    color: 'white',
  },
});

export default GlobalTouchableOpacity;
