import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';
import { GOOGLE_MAPS_API_KEY } from '@env';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface MapScreenProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ visible, onClose, onLocationSelect }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.78825, lng: -122.4324 });
  const webViewRef = useRef<WebView>(null);

  // Request location permission and get current location
  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location on the map.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(newLocation);
      setMapCenter({ lat: newLocation.latitude, lng: newLocation.longitude });

      // Get address from coordinates
      const address = await Location.reverseGeocodeAsync({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });

      let addressString = 'Current Location';
      if (address && address.length > 0) {
        const addr = address[0];
        addressString = `${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}, ${addr.region || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
      }

      setSelectedLocation({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        address: addressString,
      });

      // Update map center in WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'setCenter',
          lat: newLocation.latitude,
          lng: newLocation.longitude
        }));
      }

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const getGoogleMapsHTML = () => {
    const apiKey = GOOGLE_MAPS_API_KEY || ""; // Use environment variable
    
    if (!apiKey) {
      Alert.alert("Configuration Error", "Google Maps API key is not configured. Please add GOOGLE_MAPS_API_KEY to your .env file.");
      return '<html><body><h2>Google Maps API key not configured</h2></body></html>';
    }
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Map</title>
        <style>
            #map {
                height: 100vh;
                width: 100%;
                margin: 0;
                padding: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        
        <script>
            let map;
            let marker;
            
            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: ${mapCenter.lat}, lng: ${mapCenter.lng} },
                    zoom: 15,
                    clickableIcons: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                });
                
                // Add click listener
                map.addListener('click', function(event) {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    
                    // Remove existing marker
                    if (marker) {
                        marker.setMap(null);
                    }
                    
                    // Add new marker
                    marker = new google.maps.Marker({
                        position: { lat: lat, lng: lng },
                        map: map,
                        title: 'Selected Location'
                    });
                    
                    // Send location back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'locationSelected',
                        latitude: lat,
                        longitude: lng
                    }));
                });
                
                ${selectedLocation ? `
                // Add selected location marker
                marker = new google.maps.Marker({
                    position: { lat: ${selectedLocation.latitude}, lng: ${selectedLocation.longitude} },
                    map: map,
                    title: 'Selected Location'
                });
                ` : ''}
            }
            
            // Listen for messages from React Native
            window.addEventListener('message', function(event) {
                const data = JSON.parse(event.data);
                if (data.type === 'setCenter') {
                    map.setCenter({ lat: data.lat, lng: data.lng });
                    map.setZoom(15);
                    
                    // Remove existing marker
                    if (marker) {
                        marker.setMap(null);
                    }
                    
                    // Add new marker
                    marker = new google.maps.Marker({
                        position: { lat: data.lat, lng: data.lng },
                        map: map,
                        title: 'Current Location'
                    });
                }
            });
        </script>
        
        <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap">
        </script>
    </body>
    </html>
    `;
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'locationSelected') {
        // Get address from coordinates
        const address = await Location.reverseGeocodeAsync({
          latitude: data.latitude,
          longitude: data.longitude,
        });

        let addressString = 'Unknown location';
        if (address && address.length > 0) {
          const addr = address[0];
          addressString = `${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
        }

        const locationData = {
          latitude: data.latitude,
          longitude: data.longitude,
          address: addressString,
        };

        setSelectedLocation(locationData);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        // Use Expo Location geocoding to search for the location
        const geocodeResult = await Location.geocodeAsync(searchText);
        
        if (geocodeResult && geocodeResult.length > 0) {
          const location = geocodeResult[0];
          
          setMapCenter({ lat: location.latitude, lng: location.longitude });
          
          // Update map in WebView
          if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({
              type: 'setCenter',
              lat: location.latitude,
              lng: location.longitude
            }));
          }
          
          const locationData = {
            latitude: location.latitude,
            longitude: location.longitude,
            address: searchText,
          };
          
          setSelectedLocation(locationData);
        } else {
          Alert.alert("Location not found", "Could not find the specified location. Please try a different search term.");
        }
      } catch (error) {
        console.error('Error geocoding:', error);
        Alert.alert("Search Error", "Could not search for the location. Please check your internet connection and try again.");
      }
    } else {
      Alert.alert("Please enter a location", "Type a location in the search bar");
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      Alert.alert("Please select a location", "Tap on the map to select your location");
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Location</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textDark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Ionicons name="close" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Google Maps WebView */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: getGoogleMapsHTML() }}
          style={styles.map}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />

        {/* Current Location Button Overlay */}
        <View style={styles.mapOverlay}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {selectedLocation && (
          <View style={styles.selectedLocationInfo}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.selectedLocationText} numberOfLines={2}>
              {selectedLocation.address}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            { backgroundColor: selectedLocation ? COLORS.primary : COLORS.neutral }
          ]}
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
        >
          <Text style={[
            styles.confirmButtonText,
            { color: selectedLocation ? COLORS.textLight : COLORS.textDark }
          ]}>
            {selectedLocation ? "Confirm Location" : "Tap on map to select location"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomControls: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currentLocationText: {
    marginLeft: SPACING.sm,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedLocationText: {
    marginLeft: SPACING.sm,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    flex: 1,
    fontWeight: '500',
  },
  confirmButton: {
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SPACING.md,
    height: 44,
    marginRight: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: SIZES.borderRadius,
  },
  searchButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
});

export default MapScreen;
