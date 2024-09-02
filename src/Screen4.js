import { View, Text, StyleSheet, PermissionsAndroid ,Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import Geocoding from 'react-native-geocoding';
import GlobalTouchableOpacity from './GlobalTouchableOpacity';

Geocoding.init('AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc');

const Screen4 = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);


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

  const getCurrentPosition = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Reverse geocode the coordinates to get the location name
          try {
            const response = await Geocoding.from({ latitude, longitude });
            const address = response.results[0].formatted_address;
            setLocationName(address);
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            }).then((image) => {
              setCapturedImage(image.path);
              console.log(image);
            });


          } catch (error) {
            console.error('Error geocoding coordinates:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleButtonPress = () => {
    getCurrentPosition();

   
  };



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GlobalTouchableOpacity name="Open Camera" onPress={handleButtonPress} />
      <Text style={styles.title}>Location: {locationName}</Text>
      {capturedImage && (
      <Image
        source={{ uri: capturedImage }}
        style={{ width: 300, height: 400, margin: 10 }}
      />
    )}
   
    </View>
  );
};

export default Screen4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'red',
    fontWeight: '700',
    borderWidth: 1,
    padding: 5,
    borderColor: 'blue',
  },
});
