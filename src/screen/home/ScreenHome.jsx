import { StyleSheet, Text, View, ScrollView, Switch } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ScreenHome() {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Inicio</Text>
        <View style={styles.themeSwitch}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Membresías vendidas</Text>
        {/* Puedes agregar aquí un número, gráfico, etc */}
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Total de miembros</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Total de Colaboradores</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Ventas totales</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    height: 150,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});
