import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps'

const Screen2 = () => {
  const polygonCoordinates = [
    { latitude: 17.4490, longitude: 78.3920 },
    { latitude: 17.4495, longitude: 78.3923 },
    { latitude: 17.4500, longitude: 78.3925 },
    { latitude: 17.4502, longitude: 78.3927 },
    { latitude: 17.4504, longitude: 78.3929 },
    { latitude: 17.4496, longitude: 78.3932 },
 
    
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 17.4484,
          longitude: 78.3901,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="#FF5733"
          fillColor="rgba(255, 87, 51, 0.3)"
        />
      </MapView>

      <View style={styles.textContainer}>
        {polygonCoordinates.map((coordinate, index) => (
          <Text key={index} style={styles.text}>
            Latitude: {coordinate.latitude}, Longitude: {coordinate.longitude}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default Screen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  textContainer: {
    padding: 10,
    backgroundColor: 'white',
    width:"90%",
    position:'absolute',
    bottom:20,
    margin:15,
  },
  text: {
    fontSize: 16,
    color:'black',
    fontWeight:'900'
  },
});
