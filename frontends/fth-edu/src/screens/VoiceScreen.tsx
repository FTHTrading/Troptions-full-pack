import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function VoiceScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Voice AI</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Talk to DONK</Text>

      <View style={styles.micContainer}>
        <TouchableOpacity style={[styles.mic, { backgroundColor: colors.primary }]}>
          <Text style={[styles.micText, { color: colors.background }]}>🎙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.hint, { color: colors.textMuted }]}>Tap microphone to start</Text>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.example, { color: colors.text }]}>Try saying:</Text>
        <Text style={[styles.phrase, { color: colors.primary }]}>"What's $PICK price?"</Text>
        <Text style={[styles.phrase, { color: colors.primary }]}>"Mint a World Cup moment"</Text>
        <Text style={[styles.phrase, { color: colors.primary }]}>"Show my wallet"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40 },
  subtitle: { fontSize: 16, marginTop: 4, marginBottom: 40 },
  micContainer: { marginVertical: 40 },
  mic: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  micText: { fontSize: 48 },
  hint: { fontSize: 14, marginBottom: 40 },
  card: { padding: 20, borderRadius: 12, width: '100%' },
  example: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  phrase: { fontSize: 14, marginBottom: 8 },
});
