import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import Colors from '../../constants/Colors';

export default function VendorProfile() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Profile</Text>
      <Text style={styles.subtitle}>Manage your business details.</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subText,
    marginBottom: 40
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    backgroundColor: Colors.error,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16
  }
});
