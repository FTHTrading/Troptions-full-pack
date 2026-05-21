import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useWallet } from '../wallet/WalletProvider';

export default function WalletScreen() {
  const { colors } = useTheme();
  const { wallets, activeWallet, isLoading } = useWallet();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>

      {isLoading ? (
        <Text style={{ color: colors.textMuted }}>Loading...</Text>
      ) : activeWallet ? (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Active Wallet</Text>
          <Text style={[styles.address, { color: colors.primary }]} numberOfLines={1}>{activeWallet.address}</Text>
          <Text style={[styles.chain, { color: colors.secondary }]}>{activeWallet.chain.toUpperCase()}</Text>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.textMuted }}>No wallets connected</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]}>
        <Text style={[styles.ctaText, { color: colors.background }]}>+ Add Wallet</Text>
      </TouchableOpacity>

      <Text style={[styles.section, { color: colors.text }]}>All Wallets ({wallets.length})</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 },
  address: { fontSize: 14, fontWeight: '500' },
  chain: { fontSize: 12, marginTop: 4 },
  cta: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  ctaText: { fontSize: 16, fontWeight: 'bold' },
  section: { fontSize: 18, fontWeight: '600', marginTop: 8 },
});
