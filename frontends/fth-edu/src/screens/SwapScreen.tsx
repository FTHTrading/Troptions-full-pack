import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const POOLS = [
  { pair: 'XRP / RLUSD', tvl: '$12,450', apr: '12.4%', fee: '0.30%' },
  { pair: 'SOL / PICK', tvl: '$8,230', apr: '18.7%', fee: '0.30%' },
];

export default function SwapScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Swap & Pools</Text>

      {POOLS.map((pool, i) => (
        <View key={i} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.pair, { color: colors.text }]}>{pool.pair}</Text>
          <View style={styles.row}>
            <Text style={[styles.stat, { color: colors.textMuted }]}>TVL: {pool.tvl}</Text>
            <Text style={[styles.stat, { color: colors.primary }]}>APR: {pool.apr}</Text>
          </View>
          <Text style={[styles.fee, { color: colors.secondary }]}>Fee: {pool.fee}</Text>
        </View>
      ))}

      <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]}>
        <Text style={[styles.ctaText, { color: colors.background }]}>Connect Wallet to Swap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  pair: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 14 },
  fee: { fontSize: 12, marginTop: 8 },
  cta: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  ctaText: { fontSize: 16, fontWeight: 'bold' },
});
