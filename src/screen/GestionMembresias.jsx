import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function GestionMembresias({ navigation }) {
  const { colors } = useTheme();
  const { userToken, activeGym, refreshUserData } = useContext(AuthContext);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    color: '#FF6B00',
    status: 'activo'
  });
  const [refreshing, setRefreshing] = useState(false);

  // Cargar membresías del gym activo
  const loadMemberships = async () => {
    if (!activeGym) {
      setMemberships([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://192.168.137.1:3000/api/membership/gym/${activeGym._id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMemberships(data);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al cargar las membresías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, [activeGym]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      duracion: '',
      color: '#FF6B00',
      status: 'activo'
    });
  };

  const validateForm = () => {
    const { nombre, precio, duracion } = formData;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return false;
    }
    if (!duracion || isNaN(Number(duracion)) || Number(duracion) <= 0) {
      Alert.alert('Error', 'La duración debe ser un número válido mayor a 0');
      return false;
    }

    return true;
  };

  const handleCreateMembership = async () => {
    if (!validateForm()) return;

    if (!activeGym) {
      Alert.alert('Error', 'No hay un gimnasio activo seleccionado');
      return;
    }

    try {
      const membershipData = {
        ...formData,
        gym_id: activeGym._id,
        precio: Number(formData.precio),
        duracion: Number(formData.duracion)
      };

      console.log('📦 Datos de membresía a enviar:', membershipData);

      const res = await fetch('http://192.168.137.1:3000/api/membership/crear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(membershipData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Membresía creada correctamente');
        setShowAddModal(false);
        resetForm();
        loadMemberships();
        await refreshUserData();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('❌ Error al crear membresía:', error);
      Alert.alert('Error', 'Error al crear la membresía');
    }
  };

  const handleUpdateMembership = async () => {
    if (!validateForm()) return;

    if (!activeGym) {
      Alert.alert('Error', 'No hay un gimnasio activo seleccionado');
      return;
    }

    try {
      const membershipData = {
        ...formData,
        gym_id: activeGym._id,
        precio: Number(formData.precio),
        duracion: Number(formData.duracion)
      };

      console.log('📦 Datos de membresía a actualizar:', membershipData);

      const res = await fetch(`http://192.168.137.1:3000/api/membership/${selectedMembership._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(membershipData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Membresía actualizada correctamente');
        setShowEditModal(false);
        resetForm();
        loadMemberships();
        await refreshUserData();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('❌ Error al actualizar membresía:', error);
      Alert.alert('Error', 'Error al actualizar la membresía');
    }
  };

  const handleDeleteMembership = (membership) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar la membresía "${membership.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteMembership(membership._id) }
      ]
    );
  };

  const deleteMembership = async (membershipId) => {
    try {
      const res = await fetch(`http://192.168.137.1:3000/api/membership/${membershipId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Membresía eliminada correctamente');
        loadMemberships();
        await refreshUserData();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar la membresía');
    }
  };

  const handleEditMembership = (membership) => {
    navigation.navigate('EditarMembresia', { membership });
  };

  const renderMembershipItem = ({ item }) => (
    <View style={[styles.membershipCard, { backgroundColor: colors.card }]}>
      <View style={styles.membershipInfo}>
        <Text style={[styles.membershipName, { color: colors.text }]}>
          {item.nombre}
        </Text>
        {item.descripcion && (
          <Text style={[styles.membershipDescription, { color: colors.textSecondary }]}>
            {item.descripcion}
          </Text>
        )}
        <View style={styles.membershipDetails}>
          <Text style={[styles.membershipPrice, { color: colors.primary }]}>
            ${item.precio}
          </Text>
          <Text style={[styles.membershipDuration, { color: colors.textSecondary }]}>
            {item.duracion} días
          </Text>
        </View>
      </View>
      
      <View style={styles.membershipActions}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'activo' ? colors.success : colors.error }]}>
          <Text style={styles.statusText}>
            {item.status === 'activo' ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => handleEditMembership(item)}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => handleDeleteMembership(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMemberships();
    setRefreshing(false);
  };

  if (!activeGym) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.noGymMessage}>
          <Ionicons name="alert-circle" size={48} color={colors.primary} />
          <Text style={[styles.noGymText, { color: colors.text }]}>
            No tienes un gimnasio activo
          </Text>
          <Text style={[styles.noGymSubtext, { color: colors.textSecondary }]}>
            Ve a tu perfil para seleccionar un gimnasio
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Membresías</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CrearMembresia')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {memberships.length > 0 ? (
          <View style={styles.membershipsContainer}>
            {memberships.map((membership) => (
              <View key={membership._id} style={[styles.membershipCard, { backgroundColor: colors.card }]}>
                <View style={styles.membershipInfo}>
                  <Text style={[styles.membershipName, { color: colors.text }]}>
                    {membership.nombre}
                  </Text>
                  <Text style={[styles.membershipDescription, { color: colors.textSecondary }]}>
                    {membership.descripcion || 'Sin descripción'}
                  </Text>
                  <View style={styles.membershipDetails}>
                    <Text style={[styles.membershipPrice, { color: colors.text }]}>
                      ${membership.precio}
                    </Text>
                    <Text style={[styles.membershipDuration, { color: colors.textSecondary }]}>
                      {membership.duracion} días
                    </Text>
                  </View>
                </View>
                <View style={styles.membershipActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleEditMembership(membership)}
                  >
                    <Ionicons name="create" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                    onPress={() => handleDeleteMembership(membership)}
                  >
                    <Ionicons name="trash" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No hay membresías creadas
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Crea tu primera membresía para comenzar
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CrearMembresia')}
            >
              <Text style={styles.createButtonText}>Crear Primera Membresía</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    paddingBottom: 20,
  },
  membershipsContainer: {
    marginTop: 20,
  },
  membershipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  membershipDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  membershipDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  membershipDuration: {
    fontSize: 14,
  },
  membershipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noGymMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGymText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  noGymSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: '98%',
    maxHeight: '95%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalKeyboardContainer: {
    flex: 1,
    minHeight: 0,
  },
  modalScroll: {
    padding: 20,
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20, // Add padding to the bottom of the scroll content
  },
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  statusOptionSelected: {
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  statusTextSelected: {
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});