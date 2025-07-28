import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';

export default function GestionVentas() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card }]}> 
        <Text style={{ color: colors.text }}>GestionVentas</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    minHeight: 100,
    elevation: 3,
  },
})