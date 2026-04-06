import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { vendorApi } from '../../services/vendorApi';
import { useVendorStore } from '../../store/vendorStore';

export default function VendorEarnings() {
  const [loading, setLoading] = useState(false);
  const { incomingOrders, activeOrders, orderHistory } = useVendorStore();
  
  // Calculate live stats from the global session store
  const allOrders = [...incomingOrders, ...activeOrders, ...orderHistory];
  
  const totalOrders = allOrders.length;
  
  // Only include completed orders in revenue
  const completedOrders = orderHistory.filter(o => o.status === 'COMPLETED');
  const revenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  // Accepted orders are any that passed the PENDING state
  const accepted = activeOrders.length + completedOrders.length; 
  
  const rejected = orderHistory.filter(o => o.status === 'CANCELLED').length;

  const stats = {
    totalOrders,
    accepted,
    rejected,
    revenue,
    avgPrepTime: completedOrders.length > 0 ? '12 min' : '--', // Mock prep time logic
    rating: '4.8'
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Today's Live Overview</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValueGood}>${stats.revenue.toFixed(2)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Orders Rcvd</Text>
          <Text style={styles.statValueNeutral}>{stats.totalOrders}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Accepted / Rejected</Text>
          <Text style={styles.statValueNeutral}>{stats.accepted} / {stats.rejected}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg Prep Time</Text>
          <Text style={styles.statValueWarning}>{stats.avgPrepTime}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current Rating</Text>
          <Text style={styles.statValueGood}>{stats.rating} ⭐</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  container: {
    padding: 16, backgroundColor: Colors.grey, flexGrow: 1
  },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: Colors.black, marginBottom: 20
  },
  devButton: {
    backgroundColor: Colors.info, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24
  },
  devText: {
    color: Colors.white, fontWeight: 'bold'
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'
  },
  statBox: {
    backgroundColor: Colors.white,
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 14, color: Colors.subText, marginBottom: 8, textAlign: 'center'
  },
  statValueGood: {
    fontSize: 22, fontWeight: 'bold', color: Colors.success
  },
  statValueNeutral: {
    fontSize: 22, fontWeight: 'bold', color: Colors.text
  },
  statValueWarning: {
    fontSize: 22, fontWeight: 'bold', color: Colors.primary
  }
});
