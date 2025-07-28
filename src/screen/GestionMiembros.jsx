import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Ajusta la ruta según tu estructura

export default function GestionMiembros() {
  const { colors, isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState('lista'); // 'lista', 'info', 'direccion'
  const [selectedUser, setSelectedUser] = useState(null);

  // Datos de ejemplo
  const [users] = useState([
    {
      id: 1,
      name: 'Diego Balbuena',
      email: 'diego.b@gmail.com',
      status: 'Completed',
      // Datos generales
      firstName: 'Diego',
      lastName1: 'Balbuena',
      lastName2: 'Caballero',
      phone: '984 118 9971',
      emergencyPhone: '984 873 1616',
      rfc: 'COCH980313XXX',
      birthDate: '21/10/2001',
      // Dirección
      country: 'Mexico',
      colony: 'Bellavista',
      interiorNumber: '17',
      exteriorNumber: '2',
      zipCode: '56',
      state: 'Quintana Roo',
      municipality: 'Solidaridad',
      street: 'Av universidades',
      postalCode: '77712'
    },
    // Más usuarios de ejemplo
    ...Array(5).fill().map((_, i) => ({
      id: i + 2,
      name: 'Diego Balbuena',
      email: 'diego.b@gmail.com',
      status: i % 3 === 0 ? 'Inactive' : 'Completed',
    }))
  ]);

  const styles = createStyles(colors, isDarkMode);

  // Vista principal - Lista de usuarios
  const renderLista = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>USERS</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de usuarios */}
      <ScrollView style={styles.userList}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userCard, { 
              backgroundColor: isDarkMode ? '#3A3A3A' : '#fff',
              shadowColor: colors.text,
            }]}
            onPress={() => {
              setSelectedUser(user);
              setCurrentView('info');
            }}
          >
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#666' : '#ddd' }]}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: user.status === 'Completed' ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.statusText}>{user.status}</Text>
              </View>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Invitar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Vista de dirección
  const renderDireccion = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>USERS</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <View style={[styles.userInfoCard, { backgroundColor: isDarkMode ? '#3A3A3A' : '#fff' }]}>
        <View style={styles.userCardHeader}>
          <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#666' : '#ddd' }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userCardDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{selectedUser?.name}</Text>
            <Text style={styles.userEmail}>{selectedUser?.email}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Dirección Form */}
      <View style={[styles.formCard, { backgroundColor: isDarkMode ? '#3A3A3A' : '#fff' }]}>
        <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>DIRECCIÓN</Text>
          <TouchableOpacity>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>País</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.country}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Colonia</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.colony}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupSmall}>
              <Text style={[styles.label, { color: colors.text }]}>N. interno</Text>
              <View style={styles.inputContainerSmall}>
                <Text style={styles.inputText}>{selectedUser?.interiorNumber}</Text>
              </View>
            </View>
            <View style={styles.formGroupSmall}>
              <Text style={[styles.label, { color: colors.text }]}>N. externo</Text>
              <View style={styles.inputContainerSmall}>
                <Text style={styles.inputText}>{selectedUser?.exteriorNumber}</Text>
              </View>
            </View>
            <View style={styles.formGroupSmall}>
              <Text style={[styles.label, { color: colors.text }]}>Mz</Text>
              <View style={styles.inputContainerSmall}>
                <Text style={styles.inputText}>{selectedUser?.zipCode}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Estado</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.state}</Text>
              </View>
            </View>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Municipio</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.municipality}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Calle(s)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.street}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Código Postal</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.postalCode}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('lista')}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Vista de información general
  const renderInfo = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('lista')}>
          <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>INFO</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <View style={[styles.userInfoCard, { backgroundColor: isDarkMode ? '#3A3A3A' : '#fff' }]}>
        <View style={styles.userCardHeader}>
          <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#666' : '#ddd' }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userCardDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{selectedUser?.name}</Text>
            <Text style={styles.userEmail}>{selectedUser?.email}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Info Form */}
      <View style={[styles.formCard, { backgroundColor: isDarkMode ? '#3A3A3A' : '#fff' }]}>
        <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>DATOS GENERALES</Text>
          <TouchableOpacity>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nombre(s)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.firstName}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Primer apellido</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.lastName1}</Text>
              </View>
            </View>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Segundo apellido</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.lastName2}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Correo Electrónico</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.email}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Tel.</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.phone}</Text>
              </View>
            </View>
            <View style={styles.formGroupHalf}>
              <Text style={[styles.label, { color: colors.text }]}>Tel. de emergencia</Text>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.inputText}>{selectedUser?.emergencyPhone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>RFC</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.rfc}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Fecha de nacimiento</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{selectedUser?.birthDate}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentView('direccion')}
          >
            <Text style={styles.navButtonText}>Ver Dirección →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {currentView === 'lista' && renderLista()}
      {currentView === 'info' && renderInfo()}
      {currentView === 'direccion' && renderDireccion()}
    </View>
  );
}

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backArrow: {
    fontSize: 20,
  },
  notificationIcon: {
    padding: 5,
  },
  notificationText: {
    fontSize: 16,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#FF8C00',
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  userInfoCard: {
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCardDetails: {
    flex: 1,
    marginLeft: 15,
  },
  formCard: {
    marginHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginBottom: 80,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editIcon: {
    fontSize: 16,
  },
  formContent: {
    padding: 15,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formGroupSmall: {
    flex: 0.3,
  },
  formGroupHalf: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  inputContainer: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 12,
  },
  inputContainerSmall: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 12,
  },
  inputContainerHalf: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 12,
  },
  inputText: {
    color: '#000',
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
  navigationButtons: {
    padding: 15,
    paddingBottom: 30,
  },
  navButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});