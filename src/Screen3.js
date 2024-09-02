import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoding from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';


Geocoding.init('AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc');

const Screen3 = () => {
  const [position, setPosition] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    const checkPermissionAndGetCurrentPosition = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentPosition();
      }
    };

    checkPermissionAndGetCurrentPosition();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to function properly.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const getCurrentPosition = () => {
    const checkPermissionAndGetCurrentPosition = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      Geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setLatitude(latitude);
          setLongitude(longitude);

          // Reverse geocode the coordinates to get the location name
          try {
            const response = await Geocoding.from({ latitude, longitude });
            const address = response.results[0].formatted_address;
            setLocationName(address);
          } catch (error) {
            console.error('Error geocoding coordinates:', error);
          }

          // You can now use the mapRef to perform actions on the MapView
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    };

    checkPermissionAndGetCurrentPosition();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latitude || 0,
          longitude: longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
          />
        )}
      </MapView>

      <Text style={styles.positionText}>
        <Text style={styles.title}>Current position: </Text>
        {position}
      </Text>

      <Text style={styles.positionText}>
        <Text style={styles.title}> {locationName}</Text>
       
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  title: {
    fontWeight: '900',
    color:'black'
  },
  positionText: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
    margin:20
  },
});

export default Screen3;
