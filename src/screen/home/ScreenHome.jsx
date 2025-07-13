import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

export default function ScreenHome() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Membresías vendidas</Text>
        {/* Puedes agregar aquí un número, gráfico, etc */}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de miembros</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Colaboradores</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ventas totales</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000000ff", // Fondo claro general
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF", // Título en blanco
  },
  card: {
    backgroundColor: "#45474B",
    borderRadius: 20,
    padding: 20, // Espacio interno
    marginBottom: 20,
    width: "100%",
    height: 150, // Altura fija para el card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Para Android
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
