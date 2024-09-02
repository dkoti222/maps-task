import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geocoding from 'react-native-geocoding';
import { decode } from "@mapbox/polyline";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Geocoding.init('AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc'); 

const Screen1 = () => {
  const [hitechCityCoordinates, setHitechCityCoordinates] = useState({
    latitude: 17.4484,
    longitude: 78.3901,
  });
  const [kukatpallyCoordinates, setKukatpallyCoordinates] = useState({
    latitude: 17.4948,
    longitude: 78.3997,
  });
  const [hitechCityLocationName, setHitechCityLocationName] = useState('');
  const [kukatpallyLocationName, setKukatpallyLocationName] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);


  useEffect(() => {
    getLocationName(hitechCityCoordinates, setHitechCityLocationName);
    getLocationName(kukatpallyCoordinates, setKukatpallyLocationName);
    getRouteCoordinates(hitechCityCoordinates, kukatpallyCoordinates);
  }, []);

  const getLocationName = async (coordinates, setLocationName) => {
    try {
      const response = await Geocoding.from(coordinates);
      const address = response.results[0].formatted_address;
      setLocationName(address);
    } catch (error) {
      console.error('Error geocoding coordinates:', error);
    }
  };

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
      simulatePolylineAnimation(coords);
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
    }, 60); 
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
          image={require('../src/bike.png')}
          draggable={true}
          onDragEnd={(e) => {
            setHitechCityCoordinates(e.nativeEvent.coordinate);
            getLocationName(e.nativeEvent.coordinate, setHitechCityLocationName);
            getRouteCoordinates(e.nativeEvent.coordinate, kukatpallyCoordinates);
          
          }}
        />
        <Marker
          coordinate={kukatpallyCoordinates}
          title="Kukatpally"
          pinColor="green"
          draggable={true}
          onDragEnd={(e) => {
            setKukatpallyCoordinates(e.nativeEvent.coordinate);
            getLocationName(e.nativeEvent.coordinate, setKukatpallyLocationName);
            getRouteCoordinates(hitechCityCoordinates, e.nativeEvent.coordinate);
          
          }}
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="red"
          strokeWidth={2}
      
        />
      </MapView>

     
      <GooglePlacesAutocomplete
        placeholder="Search for Drop Location"
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        listViewDisplayed="auto"
        fetchDetails={true}
        renderDescription={(row) => row.description}
        onPress={(data, details = null) => {
          setKukatpallyCoordinates({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
          setKukatpallyLocationName(data.description);
          getRouteCoordinates(hitechCityCoordinates, {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }}
        query={{
          key: 'AIzaSyB0O9UY0zhz5EK00bTr9roqQzik9Cmxxrc',
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            margin:15,
          

          },
          listView: {
            position: 'absolute',
            top: 60,
            left: 5,
            margin:5,

          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Pickup: {hitechCityLocationName}
        </Text>
        <Text style={styles.text}>
          Drop Location: {kukatpallyLocationName}
        </Text>
      </View>
    </View>
  );
};

export default Screen1;

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
    width: '90%',
    position: 'absolute',
    bottom: 20,
    margin: 15,
  },
  text: {
    fontSize: 16,
    color: 'red',
    fontWeight: '700',
    borderWidth:1,
    padding:5,
    borderColor:'blue'
  },
});
