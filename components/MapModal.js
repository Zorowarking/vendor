import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import Colors from '../constants/Colors';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

// Lazy-load MapView to avoid crashes in Expo Go
let MapView = null;
let Marker = null;
let PROVIDER_GOOGLE = null;

try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
} catch (e) {
  // Silent catch for Expo Go
}

export default function MapModal({ visible, onClose, onConfirm, initialLocation }) {
  const isNative = Constants.appOwnership !== 'expo';
  const canShowMap = isNative && MapView;

  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude || 28.6139,
    longitude: initialLocation?.longitude || 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [marker, setMarker] = useState({
    latitude: initialLocation?.latitude || 28.6139,
    longitude: initialLocation?.longitude || 77.2090,
  });

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  const handleMapPress = (e) => {
    if (e.nativeEvent && e.nativeEvent.coordinate) {
      setMarker(e.nativeEvent.coordinate);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {canShowMap ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChange}
            onPress={handleMapPress}
          >
            <Marker 
              coordinate={marker} 
              draggable
              onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
            />
          </MapView>
        ) : (
          <View style={styles.fallbackContainer}>
            <View style={styles.fallbackContent}>
              <Text style={styles.fallbackIcon}>📍</Text>
              <Text style={styles.fallbackTitle}>Interactive Map Unavailable</Text>
              <Text style={styles.fallbackSubtitle}>
                The interactive map is only available in the real app build. 
                Using your current GPS coordinates instead.
              </Text>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Latitude: {marker.latitude.toFixed(4)}</Text>
                <Text style={styles.coordLabel}>Longitude: {marker.longitude.toFixed(4)}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.overlay}>
          {canShowMap && <Text style={styles.instruction}>Drag the pin to your exact location</Text>}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={() => onConfirm(marker)}
            >
              <Text style={styles.confirmText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  fallbackContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  fallbackIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: Colors.subText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  coordBox: {
    backgroundColor: '#f1f3f5',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  coordLabel: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.primary,
    marginBottom: 4,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  instruction: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  cancelText: {
    color: Colors.subText,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 2,
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
