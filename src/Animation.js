import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geocoding from 'react-native-geocoding';
import { decode } from "@mapbox/polyline";

Geocoding.init('AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc');

const Animation = () => {
  const [hitechCityCoordinates, setHitechCityCoordinates] = useState({
    latitude: 17.4484,
    longitude: 78.3901,
  });
  const [kukatpallyCoordinates, setKukatpallyCoordinates] = useState({
    latitude: 17.4948,
    longitude: 78.3997,
  });
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    getRouteCoordinates(hitechCityCoordinates, kukatpallyCoordinates);
  }, []);

  const getRouteCoordinates = async (startLoc, destinationLoc) => {
    try {
      const KEY = 'AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc';
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=${KEY}`
      );
      const respJson = await resp.json();
      const points = decode(respJson.routes[0].overview_polyline.points);
      const coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });

      // Simulate animation by setting coordinates with a time delay
      simulatePolylineAnimation(coords);

      // Set the coordinates immediately for the initial rendering
      setRouteCoordinates(coords);
    } catch (error) {
      console.error('Error getting route coordinates:', error);
    }
  };

  const simulatePolylineAnimation = (coordinates) => {
    let i = 0;
    const animationInterval = setInterval(() => {
      if (i < coordinates.length) {
        setRouteCoordinates(coordinates.slice(0, i + 1));
        i++;
      } else {
        clearInterval(animationInterval);
      }
    }, 100); 
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{ ...hitechCityCoordinates, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
      >
        <Marker
          coordinate={hitechCityCoordinates}
          title="Hitech City"
          draggable={true}
          onDragEnd={(e) => {
            setHitechCityCoordinates(e.nativeEvent.coordinate);
            getRouteCoordinates(e.nativeEvent.coordinate, kukatpallyCoordinates);
          }}
        />
        <Marker
          coordinate={kukatpallyCoordinates}
          title="Kukatpally"
          draggable={true}
          onDragEnd={(e) => {
            setKukatpallyCoordinates(e.nativeEvent.coordinate);
            getRouteCoordinates(hitechCityCoordinates, e.nativeEvent.coordinate);
          }}
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="red"
          strokeWidth={2}
        />
      </MapView>
    </View>
  );
};

export default Animation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
