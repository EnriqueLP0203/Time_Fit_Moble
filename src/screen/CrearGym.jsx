import React, { useState } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CrearGym = ({ navigation, userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    opening_time: '08:00',
    closing_time: '22:00',
  });

  const [showOpeningPicker, setShowOpeningPicker] = useState(false);
  const [showClosingPicker, setShowClosingPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleTimeChange = (event, selectedTime, type) => {
    if (Platform.OS === 'android') {
      setShowOpeningPicker(false);
      setShowClosingPicker(false);
    }

    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      if (type === 'opening') {
        handleInputChange('opening_time', timeString);
      } else {
        handleInputChange('closing_time', timeString);
      }
    }
  };

  const getTimeDate = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date;
  };

  const validateForm = () => {
    const { name, country, city, address, opening_time, closing_time } = formData;

    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del gimnasio es requerido');
      return false;
    }
    if (!country.trim()) {
      Alert.alert('Error', 'El país es requerido');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'La ciudad es requerida');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'La dirección es requerida');
      return false;
    }

    // Validar que la hora de apertura sea antes que la de cierre
    const openingTime = new Date(`2000-01-01T${opening_time}:00`);
    const closingTime = new Date(`2000-01-01T${closing_time}:00`);
    
    if (openingTime >= closingTime) {
      Alert.alert('Error', 'La hora de apertura debe ser anterior a la hora de cierre');
      return false;
    }

    return true;
  };

  const handleCreateGym = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const gymData = {
        ...formData,
        user_id: userId, // Se debería obtener del contexto de usuario
      };

      // Aquí iría tu lógica de API para crear el gimnasio
      console.log('Creating gym:', gymData);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Éxito', 
        'Gimnasio creado exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.goBack();
              console.log('Navigate back or to gym list');
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error creating gym:', error);
      Alert.alert('Error', 'No se pudo crear el gimnasio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // navigation.goBack();
    console.log('Navigate back');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Crear Gimnasio</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="fitness" size={32} color="#FF6B00" />
            <Text style={styles.logoText}>NUEVO GYM</Text>
          </View>
          <Text style={styles.subtitle}>Registra tu gimnasio</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Información del Gimnasio</Text>

          {/* Nombre del Gimnasio */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del Gimnasio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Gym Power"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* País */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>País</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. México"
              placeholderTextColor="#999"
              value={formData.country}
              onChangeText={(value) => handleInputChange('country', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Ciudad */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Monterrey"
              placeholderTextColor="#999"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Dirección */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Av. Ejemplo 456"
              placeholderTextColor="#999"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              autoCapitalize="words"
              autoCorrect={false}
              multiline={true}
              numberOfLines={2}
            />
          </View>

          {/* Horarios */}
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Horarios de Operación</Text>
            
            {/* Hora de Apertura */}
            <View style={styles.timeContainer}>
              <Text style={styles.label}>Hora de Apertura</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowOpeningPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(formData.opening_time)}
                </Text>
                <Ionicons name="time-outline" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>

            {/* Hora de Cierre */}
            <View style={styles.timeContainer}>
              <Text style={styles.label}>Hora de Cierre</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowClosingPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(formData.closing_time)}
                </Text>
                <Ionicons name="time-outline" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity 
            style={[styles.createButton, loading && styles.disabledButton]} 
            onPress={handleCreateGym}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creando...' : 'Crear Gimnasio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Time Pickers */}
      {showOpeningPicker && (
        <DateTimePicker
          value={getTimeDate(formData.opening_time)}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedTime) => 
            handleTimeChange(event, selectedTime, 'opening')
          }
        />
      )}

      {showClosingPicker && (
        <DateTimePicker
          value={getTimeDate(formData.closing_time)}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedTime) => 
            handleTimeChange(event, selectedTime, 'closing')
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '300',
  },
  formSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
  },
  timeSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeContainer: {
    marginBottom: 16,
  },
  timeButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#FF6B0080',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CrearGym;