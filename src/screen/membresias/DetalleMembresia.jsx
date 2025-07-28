import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const DetalleMembresia = ({ route }) => {
  const { colors } = useTheme();
  const { membresia } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Detalle de Membresía</Text>

      <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Nombre:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{membresia.nombre}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Duración:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{membresia.duracion} días</Text>

        <Text style={[styles.label, { color: colors.text }]}>Precio:</Text>
        <Text style={[styles.value, { color: colors.text }]}>${membresia.precio}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{membresia.descripcion}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default DetalleMembresia;
