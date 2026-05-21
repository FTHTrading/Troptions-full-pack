import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const COURSES = [
  { id: 1, title: 'Crypto Basics', level: 'Beginner', duration: '15 min' },
  { id: 2, title: 'Solana Deep Dive', level: 'Intermediate', duration: '30 min' },
  { id: 3, title: 'AMM & Liquidity', level: 'Advanced', duration: '45 min' },
  { id: 4, title: 'World Cup 2026 Markets', level: 'All Levels', duration: '20 min' },
];

export default function LearnScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Master crypto & trading</Text>

      {COURSES.map(course => (
        <TouchableOpacity key={course.id} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{course.title}</Text>
          <View style={styles.row}>
            <Text style={[styles.badge, { color: colors.primary, borderColor: colors.primary }]}>{course.level}</Text>
            <Text style={[styles.duration, { color: colors.textMuted }]}>{course.duration}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 20, color: '#888' },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  badge: { fontSize: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  duration: { fontSize: 12 },
});
