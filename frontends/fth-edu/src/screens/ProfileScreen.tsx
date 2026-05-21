import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function ProfileScreen() {
  const { colors, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Account</Text>
        <Text style={[styles.value, { color: colors.text }]}>TROPTIONS Member</Text>
      </View>

      <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={toggleTheme}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Appearance</Text>
        <Text style={[styles.value, { color: colors.text }]}>Toggle Dark/Light Mode →</Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Support</Text>
        <Text style={[styles.value, { color: colors.text }]}>1-888-690-DONK</Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>TROPTIONS © 2003-2026</Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>World Cup 2026 Atlanta</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500' },
  footer: { marginTop: 40, paddingTop: 20, borderTopWidth: 1, alignItems: 'center' },
  footerText: { fontSize: 12, marginBottom: 4 },
});
