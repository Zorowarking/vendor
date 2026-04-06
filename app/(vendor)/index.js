import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import Colors from '../../constants/Colors';

export default function VendorHome() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to your store management!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.subText, marginBottom: 40 },
  logoutButton: { padding: 15, backgroundColor: Colors.error, borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: 'bold' }
});
