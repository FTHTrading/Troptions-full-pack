import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>TROPTIONS</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>22 Years of Trade Evolution</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>World Cup 2026 Atlanta</Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>June 11, 2026</Text>
        <Text style={[styles.highlight, { color: colors.secondary }]}>48 Matches • 16 Cities • 5B Viewers</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>$PICK Token</Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>Solana Mainnet</Text>
        <Text style={[styles.highlight, { color: colors.primary }]}>1M Max Supply</Text>
      </View>

      <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]}>
        <Text style={[styles.ctaText, { color: colors.background }]}>Mint a Moment →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: { margin: 16, padding: 20, borderRadius: 12, backgroundColor: '#1a1a2e' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  cardText: { fontSize: 14, marginBottom: 4 },
  highlight: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  cta: { margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: 'bold' },
});
