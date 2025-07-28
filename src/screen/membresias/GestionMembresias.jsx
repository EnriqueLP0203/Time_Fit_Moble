import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';


const dummyMembresias = [
  { id: '1', nombre: 'Gym Rookie', miembros: 5, precio: 199, progreso: 0 },
  { id: '2', nombre: 'Gym Avanzado', miembros: 10, precio: 299, progreso: 0 },
  { id: '3', nombre: 'Gym Pro', miembros: 20, precio: 499, progreso: 0 },
  { id: '4', nombre: 'Gym Rookie', miembros: 0, precio: 199, progreso: 0 },
  { id: '5', nombre: 'Gym Rookie', miembros: 0, precio: 199, progreso: 0 },
];

export default function GestionMembresias() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();

  const handleVerDetalles = (membresia) => {
    navigation.navigate('DetalleMembresia', { membresia });
  };

  const handleAgregarMembresia = () => {
    navigation.navigate('CrearMembresia');
  };

  // Componente para el círculo de progreso
  const CirculoProgreso = ({ porcentaje }) => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressCircle, { 
        borderColor: colors.border, 
        backgroundColor: isDarkMode ? '#2A2A2A' : '#f0f0f0' 
      }]}>
        <Text style={[styles.progressText, { color: colors.text }]}>{porcentaje}%</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Membresías</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Botón Agregar */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: '#FF6A00' }]} 
        onPress={handleAgregarMembresia}
      >
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>

      {/* Lista de Membresías */}
      <FlatList
        data={dummyMembresias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleVerDetalles(item)} 
            style={[styles.card, { 
              backgroundColor: colors.card, // 👈 USAR colors.card en lugar de '#3A3A3A'
              shadowColor: isDarkMode ? '#000' : '#000',
            }]}
          >
            {/* Icono de alerta */}
            <View style={styles.alertIcon}>
              <MaterialIcons name="warning" size={18} color="#FF4444" />
            </View>
            
            {/* Contenido principal */}
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <CirculoProgreso porcentaje={item.progreso} />
              </View>
              
              <View style={styles.cardCenter}>
                <Text style={[styles.cardTitle, { color: '#FF6A00' }]}>{item.nombre}</Text>
                <Text style={[styles.cardText, { color: colors.text }]}>
                  Miembros actuales: {item.miembros.toString().padStart(3, '0')}
                </Text>
                <Text style={[styles.cardText, { color: colors.text }]}>
                  Precio mensual: {item.precio.toString().padStart(3, '0')}
                </Text>
              </View>
              
              <View style={styles.cardRight}>
                <TouchableOpacity style={[styles.editIcon, { backgroundColor: '#FF6A00' }]}>
                  <MaterialIcons name="edit" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // 👈 NO poner backgroundColor aquí, se pone dinámicamente arriba
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // 👈 NO poner color aquí, se pone dinámicamente arriba
  },
  notificationIcon: {
    padding: 8,
  },
  addButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: 15,
  },
  progressContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardCenter: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardRight: {
    padding: 5,
  },
  editIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});