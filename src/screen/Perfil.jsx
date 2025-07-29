import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../context/authContext";
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function Perfil() {
  const { 
    logout, 
    userInfo, 
    userToken,
    activeGym, 
    userGyms, 
    changeActiveGym,
    loadUserDataWithRetry
  } = useContext(AuthContext);
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [showGymSelector, setShowGymSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug logs
  console.log('🏋️ Perfil - userGyms:', userGyms?.length || 0);
  console.log('🏋️ Perfil - activeGym:', activeGym ? activeGym.name : 'No hay gym activo');
  console.log('🏋️ Perfil - userInfo:', userInfo?.name || 'No hay userInfo');

  // Forzar recarga de datos cuando se monta la pantalla
  useEffect(() => {
    console.log('🔄 Perfil montado, recargando datos...');
    loadUserDataWithRetry();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleChangeGym = async (gymId) => {
    setLoading(true);
    const result = await changeActiveGym(gymId);
    setLoading(false);
    
    if (result.success) {
      Alert.alert('Éxito', result.message);
      setShowGymSelector(false);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleCreateNewGym = () => {
    // Navegar a la pantalla de crear gym dentro del stack de perfil
    navigation.navigate('CrearGym');
  };

  const handleDeleteGym = (gym) => {
    Alert.alert(
      'Eliminar gimnasio',
      `¿Estás seguro de que quieres eliminar "${gym.name}"? Esta acción también eliminará todas las membresías y clientes asociados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteGym(gym._id), style: 'destructive' }
      ]
    );
  };

  const deleteGym = async (gymId) => {
    try {
      console.log('🗑️ Intentando eliminar gym:', gymId);
      console.log('🔑 Token disponible:', userToken ? 'Sí' : 'No');
      console.log('🔑 Token length:', userToken ? userToken.length : 0);
      
      const res = await fetch(`http://192.168.137.1:3000/api/gym/${gymId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      console.log('📡 Respuesta del servidor:', res.status);
      
      if (res.ok) {
        console.log('✅ Gym eliminado correctamente');
        Alert.alert('Éxito', 'Gimnasio eliminado correctamente');
        
        // Recargar datos del usuario
        await loadUserDataWithRetry();
        
        // Si era el gym activo y no quedan más gyms, redirigir a crear gym
        if (activeGym && activeGym._id === gymId) {
          if (userGyms.length <= 1) {
            // Era el último gym, redirigir a crear gym
            navigation.navigate('CrearGym');
          } else {
            // Cambiar al siguiente gym disponible
            const remainingGyms = userGyms.filter(gym => gym._id !== gymId);
            if (remainingGyms.length > 0) {
              await changeActiveGym(remainingGyms[0]._id);
            }
          }
        }
      } else {
        const errorData = await res.json();
        console.log('❌ Error al eliminar gym:', errorData);
        Alert.alert('Error', errorData.message || 'Error al eliminar el gimnasio');
      }
    } catch (error) {
      console.log('❌ Error de red al eliminar gym:', error);
      Alert.alert('Error', 'Error de conexión al eliminar el gimnasio');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteAccount(), style: 'destructive' }
      ]
    );
  };

  const deleteAccount = async () => {
    try {
      console.log('🗑️ Intentando eliminar cuenta...');
      console.log('🔑 Token disponible:', userToken ? 'Sí' : 'No');
      console.log('🔑 Token length:', userToken ? userToken.length : 0);
      
      const res = await fetch(`http://192.168.137.1:3000/api/user`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      console.log('📡 Respuesta del servidor:', res.status);
      
      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        // Si la respuesta no es JSON, mostrar mensaje genérico
        console.log('❌ Respuesta no es JSON:', e);
        Alert.alert('Error', 'Respuesta inesperada del servidor.');
        return;
      }

      if (res.ok) {
        console.log('✅ Cuenta eliminada correctamente');
        Alert.alert('Éxito', 'Tu cuenta ha sido eliminada.');
        logout(); // Cerrar sesión después de eliminar la cuenta
      } else {
        console.log('❌ Error del servidor:', data);
        Alert.alert('Error', data.message || 'Error al eliminar la cuenta.');
      }
    } catch (error) {
      console.log('❌ Error al eliminar cuenta:', error);
      Alert.alert('Error', 'Error al eliminar la cuenta.');
    }
  };

  const handleEditGym = (gym) => {
    navigation.navigate('EditarGym', { gym });
  };

  const renderGymItem = ({ item }) => (
    <View style={[styles.gymItem, { backgroundColor: colors.card }]}>
      <View style={styles.gymInfo}>
        <Text style={[styles.gymName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.gymLocation, { color: colors.textSecondary }]}>
          {item.city && item.country ? `${item.city}, ${item.country}` : 'Sin ubicación'}
        </Text>
        <Text style={[styles.gymSchedule, { color: colors.textSecondary }]}>
          {item.opening_time} - {item.closing_time}
        </Text>
      </View>
      
      <View style={styles.gymActions}>
        {activeGym?._id === item._id && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>Activo</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditGym(item)}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.selectButton]}
          onPress={() => handleChangeGym(item._id)}
          disabled={loading}
        >
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteGym(item)}
        >
          <Ionicons name="trash" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.userInfoHeader}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userInfo?.name} {userInfo?.lastname}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {userInfo?.email}
            </Text>
            <Text style={[styles.userUsername, { color: colors.textSecondary }]}>
              @{userInfo?.username}
            </Text>
          </View>
        </View>
        
        {/* User Actions */}
        <View style={styles.userActions}>
          <TouchableOpacity 
            style={[styles.userActionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.userActionButton, { backgroundColor: isDarkMode ? '#4A90E2' : '#FF9800' }]}
            onPress={toggleTheme}
          >
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.userActionButton, { backgroundColor: '#FF4444' }]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Gym Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Gimnasio Activo</Text>
        
        {activeGym ? (
          <View style={styles.activeGymInfo}>
            <View style={styles.gymHeader}>
              <Ionicons name="barbell" size={24} color="#FF6B00" />
              <Text style={[styles.activeGymName, { color: colors.text }]}>
                {activeGym.name}
              </Text>
            </View>
            
            <View style={styles.gymDetails}>
              <Text style={[styles.gymDetail, { color: colors.textSecondary }]}>
                📍 {activeGym.city && activeGym.country ? `${activeGym.city}, ${activeGym.country}` : 'Sin ubicación'}
              </Text>
              <Text style={[styles.gymDetail, { color: colors.textSecondary }]}>
                🕒 {activeGym.opening_time} - {activeGym.closing_time}
              </Text>
              <Text style={[styles.gymDetail, { color: colors.textSecondary }]}>
                📅 Creado: {new Date(activeGym.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noGymMessage}>
            <Ionicons name="alert-circle" size={24} color="#FF6B00" />
            <Text style={[styles.noGymText, { color: colors.textSecondary }]}>
              No tienes un gimnasio activo
            </Text>
          </View>
        )}
      </View>

      {/* Gym Management */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mis Gimnasios</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateNewGym}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {userGyms.length > 0 ? (
          <FlatList
            data={userGyms}
            renderItem={renderGymItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            style={styles.gymList}
          />
        ) : (
          <View style={styles.noGymsMessage}>
            <Ionicons name="business" size={24} color="#FF6B00" />
            <Text style={[styles.noGymsText, { color: colors.textSecondary }]}>
              No tienes gimnasios creados
            </Text>
            <Text style={[styles.noGymsSubtext, { color: colors.textSecondary }]}>
              Toca el botón + para crear tu primer gimnasio
            </Text>
          </View>
        )}

        {userGyms.length > 1 && (
          <TouchableOpacity
            style={[styles.changeGymButton, { backgroundColor: '#FF6B00' }]}
            onPress={() => setShowGymSelector(true)}
          >
            <Text style={styles.changeGymButtonText}>Cambiar Gimnasio</Text>
          </TouchableOpacity>
        )}
      </View>



      {/* Gym Selector Modal */}
      <Modal
        visible={showGymSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGymSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Seleccionar Gimnasio
            </Text>
            
            <FlatList
              data={userGyms}
              renderItem={renderGymItem}
              keyExtractor={(item) => item._id}
              style={styles.modalGymList}
            />
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGymSelector(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activeGymInfo: {
    marginTop: 8,
  },
  gymHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeGymName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  gymDetails: {
    marginLeft: 32,
  },
  gymDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  noGymMessage: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noGymText: {
    marginTop: 8,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymList: {
    marginBottom: 16,
  },
  gymItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gymLocation: {
    fontSize: 12,
    marginBottom: 2,
  },
  gymSchedule: {
    fontSize: 12,
  },
  gymActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userActionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  noGymsMessage: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noGymsText: {
    marginTop: 8,
    fontSize: 14,
  },
  noGymsSubtext: {
    marginTop: 4,
    fontSize: 12,
  },
  changeGymButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeGymButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalGymList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    backgroundColor: '#FF6B00',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userActions: {
    marginTop: 16,
  },
});
