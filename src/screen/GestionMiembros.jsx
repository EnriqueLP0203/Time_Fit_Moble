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

export default function GestionMiembros({ navigation }) {
  const { colors } = useTheme();
  const { userToken, activeGym, refreshUserData } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone_number: '',
    birth_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    membership_id: '',
    start_date: '',
    end_date: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  // Cargar clientes del gym activo
  const loadCustomers = async () => {
    if (!activeGym) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://192.168.137.1:3000/api/customer/gym/${activeGym._id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCustomers(data);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Cargar membresías para el formulario
  const loadMemberships = async () => {
    if (!activeGym) return;

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
      }
    } catch (error) {
      console.log('Error al cargar membresías:', error);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadMemberships();
  }, [activeGym]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si se selecciona una membresía, calcular automáticamente la fecha de fin
    if (field === 'membership_id') {
      const membership = memberships.find(m => m._id === value);
      if (membership && formData.start_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + membership.duracion);
        
        setFormData(prev => ({
          ...prev,
          membership_id: value,
          end_date: endDate.toISOString().split('T')[0]
        }));
      }
    }

    // Si se cambia la fecha de inicio y hay una membresía seleccionada, calcular la fecha de fin
    if (field === 'start_date' && formData.membership_id) {
      const membership = memberships.find(m => m._id === formData.membership_id);
      if (membership && validateDateInput(value)) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + membership.duracion);
        
        setFormData(prev => ({
          ...prev,
          start_date: value,
          end_date: endDate.toISOString().split('T')[0]
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastname: '',
      email: '',
      phone_number: '',
      birth_date: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      membership_id: '',
      start_date: '',
      end_date: ''
    });
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateForm = () => {
    const { name, lastname, email, phone_number, birth_date, membership_id, start_date, end_date } = formData;

    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!lastname.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return false;
    }
    if (!phone_number.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return false;
    }
    if (!birth_date || !validateDateInput(birth_date)) {
      Alert.alert('Error', 'La fecha de nacimiento debe tener el formato YYYY-MM-DD');
      return false;
    }
    
    // Validar edad mínima de 18 años
    const age = validateAge(birth_date);
    if (age < 18) {
      Alert.alert('Error', 'El cliente debe tener al menos 18 años');
      return false;
    }
    
    if (!membership_id) {
      Alert.alert('Error', 'Debes seleccionar una membresía');
      return false;
    }
    if (!start_date || !validateDateInput(start_date)) {
      Alert.alert('Error', 'La fecha de inicio debe tener el formato YYYY-MM-DD');
      return false;
    }
    if (!end_date || !validateDateInput(end_date)) {
      Alert.alert('Error', 'La fecha de fin debe tener el formato YYYY-MM-DD');
      return false;
    }

    return true;
  };



  const handleCreateCustomer = async () => {
    if (!validateForm()) return;

    try {
      const customerData = {
        ...formData,
        emergency_contact: {
          name: formData.emergency_contact_name,
          phone: formData.emergency_contact_phone
        },
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date)
      };

      delete customerData.emergency_contact_name;
      delete customerData.emergency_contact_phone;

      const res = await fetch('http://192.168.137.1:3000/api/customer/crear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Cliente creado correctamente');
        setShowAddModal(false);
        resetForm();
        loadCustomers();
        await refreshUserData(); // Refrescar datos del usuario
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al crear el cliente');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!validateForm()) return;

    try {
      const customerData = {
        ...formData,
        emergency_contact: {
          name: formData.emergency_contact_name,
          phone: formData.emergency_contact_phone
        },
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date)
      };

      delete customerData.emergency_contact_name;
      delete customerData.emergency_contact_phone;

      const res = await fetch(`http://192.168.137.1:3000/api/customer/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Cliente actualizado correctamente');
        setShowEditModal(false);
        resetForm();
        loadCustomers();
        await refreshUserData();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el cliente');
    }
  };

  const handleDeleteCustomer = (customer) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar a ${customer.name} ${customer.lastname}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteCustomer(customer._id) }
      ]
    );
  };

  const deleteCustomer = async (customerId) => {
    try {
      const res = await fetch(`http://192.168.137.1:3000/api/customer/${customerId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Cliente eliminado correctamente');
        loadCustomers();
        await refreshUserData();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el cliente');
    }
  };

  const handleEditCustomer = (customer) => {
    navigation.navigate('EditarCliente', { customer });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? colors.success : colors.error;
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activa' : 'Inactiva';
  };

  const renderCustomerItem = ({ item }) => (
    <View style={[styles.customerCard, { backgroundColor: colors.card }]}>
      <View style={styles.customerInfo}>
        <Text style={[styles.customerName, { color: colors.text }]}>
          {item.name} {item.lastname}
        </Text>
        <Text style={[styles.customerEmail, { color: colors.textSecondary }]}>
          {item.email}
        </Text>
        <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>
          {item.phone_number}
        </Text>
        <View style={styles.membershipInfo}>
          <Text style={[styles.membershipName, { color: colors.text }]}>
            {item.membership_id?.nombre}
          </Text>
          <Text style={[styles.membershipPrice, { color: colors.textSecondary }]}>
            ${item.membership_id?.precio}
          </Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            Inicio: {new Date(item.start_date).toLocaleDateString()}
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            Fin: {new Date(item.end_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.customerActions}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => handleEditCustomer(item)}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => handleDeleteCustomer(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAddModal = () => {
    return (
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          closeAddModal();
        }}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  closeAddModal();
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Nuevo Cliente
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalKeyboardContainer}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <ScrollView 
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* Información Personal */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    <Ionicons name="person" size={16} color={colors.primary} /> Información Personal
                  </Text>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                        placeholder="Ingresa el nombre"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.inputHalf}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Apellido</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                        placeholder="Ingresa el apellido"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.lastname}
                        onChangeText={(value) => handleInputChange('lastname', value)}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="ejemplo@email.com"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="+1 234 567 8900"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.phone_number}
                    onChangeText={(value) => handleInputChange('phone_number', value)}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de nacimiento</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.birth_date}
                    onChangeText={(value) => handleDateInputChange('birth_date', value)}
                    keyboardType="numeric"
                    maxLength={10}
                    returnKeyType="next"
                  />
                </View>

                {/* Contacto de Emergencia */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    <Ionicons name="warning" size={16} color={colors.primary} /> Contacto de Emergencia
                  </Text>
                  
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre del contacto</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="Nombre del contacto de emergencia"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.emergency_contact_name}
                    onChangeText={(value) => handleInputChange('emergency_contact_name', value)}
                    returnKeyType="next"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono del contacto</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="+1 234 567 8900"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.emergency_contact_phone}
                    onChangeText={(value) => handleInputChange('emergency_contact_phone', value)}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                  />
                </View>

                {/* Membresía */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    <Ionicons name="card" size={16} color={colors.primary} /> Membresía
                  </Text>
                  
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Seleccionar membresía</Text>
                  <View style={styles.membershipContainer}>
                    {memberships.map((membership) => (
                      <TouchableOpacity
                        key={membership._id}
                        style={[
                          styles.membershipOption,
                          { backgroundColor: colors.inputBackground },
                          formData.membership_id === membership._id && styles.membershipOptionSelected
                        ]}
                        onPress={() => handleInputChange('membership_id', membership._id)}
                      >
                        <View style={styles.membershipInfo}>
                          <Text style={[
                            styles.membershipName,
                            { color: colors.text },
                            formData.membership_id === membership._id && styles.membershipTextSelected
                          ]}>
                            {membership.nombre}
                          </Text>
                          <Text style={[
                            styles.membershipPrice,
                            { color: colors.textSecondary },
                            formData.membership_id === membership._id && styles.membershipTextSelected
                          ]}>
                            ${membership.precio} - {membership.duracion} días
                          </Text>
                        </View>
                        {formData.membership_id === membership._id && (
                          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Fechas */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    <Ionicons name="calendar" size={16} color={colors.primary} /> Fechas de Membresía
                  </Text>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de inicio</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.start_date}
                        onChangeText={(value) => handleDateInputChange('start_date', value)}
                        keyboardType="numeric"
                        maxLength={10}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.inputHalf}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de fin</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.end_date}
                        onChangeText={(value) => handleDateInputChange('end_date', value)}
                        keyboardType="numeric"
                        maxLength={10}
                        returnKeyType="done"
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            {/* Botones del modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                onPress={() => {
                  closeAddModal();
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateCustomer}
              >
                <Text style={styles.confirmButtonText}>Crear Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeEditModal()}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, width: '98%', maxHeight: '95%' }]}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                closeEditModal();
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Editar Cliente
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Información Personal */}
              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  <Ionicons name="person" size={16} color={colors.primary} /> Información Personal
                </Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      placeholder="Ingresa el nombre"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Apellido</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      placeholder="Ingresa el apellido"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.lastname}
                      onChangeText={(value) => handleInputChange('lastname', value)}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="ejemplo@email.com"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.phone_number}
                  onChangeText={(value) => handleInputChange('phone_number', value)}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de nacimiento</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.birth_date}
                  onChangeText={(value) => handleDateInputChange('birth_date', value)}
                  keyboardType="numeric"
                  maxLength={10}
                  returnKeyType="next"
                />
              </View>

              {/* Contacto de Emergencia */}
              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  <Ionicons name="warning" size={16} color={colors.primary} /> Contacto de Emergencia
                </Text>
                
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre del contacto</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="Nombre del contacto de emergencia"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.emergency_contact_name}
                  onChangeText={(value) => handleInputChange('emergency_contact_name', value)}
                  returnKeyType="next"
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono del contacto</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.emergency_contact_phone}
                  onChangeText={(value) => handleInputChange('emergency_contact_phone', value)}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
              </View>

              {/* Membresía */}
              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  <Ionicons name="card" size={16} color={colors.primary} /> Membresía
                </Text>
                
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Seleccionar membresía</Text>
                <View style={styles.membershipContainer}>
                  {memberships.map((membership) => (
                    <TouchableOpacity
                      key={membership._id}
                      style={[
                        styles.membershipOption,
                        { backgroundColor: colors.inputBackground },
                        formData.membership_id === membership._id && styles.membershipOptionSelected
                      ]}
                      onPress={() => handleInputChange('membership_id', membership._id)}
                    >
                      <View style={styles.membershipInfo}>
                        <Text style={[
                          styles.membershipName,
                          { color: colors.text },
                          formData.membership_id === membership._id && styles.membershipTextSelected
                        ]}>
                          {membership.nombre}
                        </Text>
                        <Text style={[
                          styles.membershipPrice,
                          { color: colors.textSecondary },
                          formData.membership_id === membership._id && styles.membershipTextSelected
                        ]}>
                          ${membership.precio} - {membership.duracion} días
                        </Text>
                      </View>
                      {formData.membership_id === membership._id && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Fechas */}
              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  <Ionicons name="calendar" size={16} color={colors.primary} /> Fechas de Membresía
                </Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de inicio</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.start_date}
                      onChangeText={(value) => handleDateInputChange('start_date', value)}
                      keyboardType="numeric"
                      maxLength={10}
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de fin</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.end_date}
                      onChangeText={(value) => handleDateInputChange('end_date', value)}
                      keyboardType="numeric"
                      maxLength={10}
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Botones del modal */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]}
              onPress={() => {
                closeEditModal();
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleUpdateCustomer}
            >
              <Text style={styles.confirmButtonText}>Actualizar Cliente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  const formatDateInput = (text) => {
    // Remover todos los caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    
    // Aplicar formato YYYY-MM-DD
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.slice(0, 4) + '-' + numbers.slice(4);
    } else {
      return numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8);
    }
  };

  const handleDateInputChange = (field, value) => {
    const formattedValue = formatDateInput(value);
    
    // Limitar a 10 caracteres (YYYY-MM-DD)
    if (formattedValue.length <= 10) {
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    }
  };

  const validateDateInput = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
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
          <Text style={[styles.title, { color: colors.text }]}>Clientes</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CrearCliente')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {customers.length > 0 ? (
          <View style={styles.customersContainer}>
            {customers.map((customer) => (
              <View key={customer._id} style={[styles.customerCard, { backgroundColor: colors.card }]}>
                <View style={styles.customerInfo}>
                  <Text style={[styles.customerName, { color: colors.text }]}>
                    {customer.name} {customer.lastname}
                  </Text>
                  <Text style={[styles.customerEmail, { color: colors.textSecondary }]}>
                    {customer.email}
                  </Text>
                  <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>
                    {customer.phone_number}
                  </Text>
                  <View style={styles.customerDetails}>
                    <Text style={[styles.customerMembership, { color: colors.text }]}>
                      {customer.membership_id?.nombre || 'Sin membresía'}
                    </Text>
                    <Text style={[styles.customerStatus, { color: getStatusColor(customer.status) }]}>
                      {getStatusText(customer.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.customerActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleEditCustomer(customer)}
                  >
                    <Ionicons name="create" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                    onPress={() => handleDeleteCustomer(customer)}
                  >
                    <Ionicons name="trash" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No hay clientes registrados
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Agrega tu primer cliente para comenzar
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CrearCliente')}
            >
              <Text style={styles.createButtonText}>Agregar Primer Cliente</Text>
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
    paddingBottom: 20,
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
  customersContainer: {
    marginTop: 20,
  },
  customerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    marginBottom: 8,
  },
  customerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  customerMembership: {
    fontSize: 14,
    fontWeight: '500',
  },
  customerStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  membershipInfo: {
    marginTop: 8,
  },
  membershipName: {
    fontSize: 14,
    fontWeight: '500',
  },
  membershipPrice: {
    fontSize: 12,
  },
  dateInfo: {
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
  },
  customerActions: {
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
    paddingVertical: 40,
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
    textAlign: 'center',
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
    paddingBottom: 20,
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  membershipContainer: {
    marginTop: 8,
  },
  membershipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  membershipOptionSelected: {
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  membershipInfo: {
    flex: 1,
  },
  membershipName: {
    fontSize: 14,
    fontWeight: '500',
  },
  membershipPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  membershipTextSelected: {
    color: '#FF6B00',
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
  // Date picker styles
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  dateScroll: {
    maxHeight: 300,
    width: '100%',
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDateOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
});