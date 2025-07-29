import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

const ScreenCrearGym = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    opening_time: '',
    closing_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState('opening');
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  
  const rutas = useNavigation();
  const { userToken, setNeedsGym, updateUserInfoAfterGymCreation } = useContext(AuthContext);
  const { colors } = useTheme();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const openTimePicker = (type) => {
    setCurrentTimeType(type);
    
    // Si ya hay una hora seleccionada, cargarla
    const currentTime = type === 'opening' ? formData.opening_time : formData.closing_time;
    if (currentTime) {
      const [hour, minute] = currentTime.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
    } else {
      setSelectedHour(8);
      setSelectedMinute(0);
    }
    
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    const timeString = formatTime(selectedHour, selectedMinute);
    
    if (currentTimeType === 'opening') {
      setFormData(prev => ({
        ...prev,
        opening_time: timeString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        closing_time: timeString
      }));
    }
    
    setShowTimePicker(false);
  };

  const validateForm = () => {
    const { name, opening_time, closing_time } = formData;

    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del gimnasio es requerido');
      return false;
    }
    if (!opening_time.trim()) {
      Alert.alert('Error', 'La hora de apertura es requerida');
      return false;
    }
    if (!closing_time.trim()) {
      Alert.alert('Error', 'La hora de cierre es requerida');
      return false;
    }

    return true;
  };

  const handleCreateGym = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('http://192.168.137.1:3000/api/gym/crear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizar el contexto para indicar que ya tiene gym
        setNeedsGym(false);
        
        // Actualizar toda la información del usuario
        await updateUserInfoAfterGymCreation(data);
        
        // Mostrar mensaje de éxito
        Alert.alert('Éxito', 'Gimnasio creado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              // Navegar a las pestañas principales
              navigation.navigate('MainTabs');
            }
          }
        ]);
      } else {
        throw new Error(data.message || 'Error al crear el gimnasio');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimePicker = () => (
    <Modal
      visible={showTimePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimePicker(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {currentTimeType === 'opening' ? 'Hora de Apertura' : 'Hora de Cierre'}
          </Text>
          
          <View style={styles.timeSelector}>
            <View style={styles.timeColumn}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Hora</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 24 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timeOption,
                      selectedHour === i && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedHour(i)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      { color: colors.text },
                      selectedHour === i && styles.selectedTimeOptionText
                    ]}>
                      {i.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
            
            <View style={styles.timeColumn}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Minuto</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 60 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timeOption,
                      selectedMinute === i && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedMinute(i)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      { color: colors.text },
                      selectedMinute === i && styles.selectedTimeOptionText
                    ]}>
                      {i.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={confirmTime}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.dark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Crear Gimnasio</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Form */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Información del Gimnasio</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre del Gimnasio</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Nombre del gimnasio"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Dirección</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Dirección del gimnasio"
                placeholderTextColor={colors.textSecondary}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ciudad</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  placeholder="Ciudad"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>País</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  placeholder="País"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.country}
                  onChangeText={(value) => handleInputChange('country', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Teléfono del gimnasio"
                placeholderTextColor={colors.textSecondary}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hora de Apertura</Text>
                <TouchableOpacity
                  style={[styles.timePickerButton, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border
                  }]}
                  onPress={() => openTimePicker('opening')}
                >
                  <Text style={[styles.timePickerText, { color: colors.text }]}>
                    {formData.opening_time || '08:00'}
                  </Text>
                  <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hora de Cierre</Text>
                <TouchableOpacity
                  style={[styles.timePickerButton, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border
                  }]}
                  onPress={() => openTimePicker('closing')}
                >
                  <Text style={[styles.timePickerText, { color: colors.text }]}>
                    {formData.closing_time || '22:00'}
                  </Text>
                  <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Create Gym Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateGym}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Creando...' : 'Crear Gimnasio'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderTimePicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  cancelHeaderButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  timePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
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
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  timeScroll: {
    maxHeight: 200,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
  },
  timeOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTimeOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
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
    paddingVertical: 12,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ScreenCrearGym;