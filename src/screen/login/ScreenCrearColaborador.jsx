import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Menu, Provider } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function ScreenCrearColaborador() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [rol, setRol] = useState('Staff');
  const [menuVisible, setMenuVisible] = useState(false);

  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const roles = ['Admin', 'Manager', 'Staff', 'Trainee'];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#E53E3E'; // Rojo
      case 'Manager': return '#3182CE'; // Azul
      case 'Staff': return '#38A169'; // Verde
      case 'Trainee': return '#D69E2E'; // Amarillo
      default: return colors.primary;
    }
  };

  const handleCrearColaborador = () => {
    if (!nombre || !email || !telefono || !password || !confirmPassword || !departamento) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Aquí iría la lógica para crear el colaborador
    Alert.alert(
      'Éxito', 
      `Colaborador creado exitosamente\nNombre: ${nombre}\nRol: ${rol}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <Provider>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card }]}>
          <Card.Content>
            <Text style={[styles.title, { color: colors.text }]}>
              Crear Nuevo Colaborador
            </Text>

            <TextInput
              label="Nombre Completo"
              value={nombre}
              onChangeText={setNombre}
              mode="outlined"
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Departamento"
              value={departamento}
              onChangeText={setDepartamento}
              mode="outlined"
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <View style={styles.roleContainer}>
              <Text style={[styles.roleLabel, { color: colors.text }]}>Rol:</Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setMenuVisible(true)}
                    buttonColor={getRoleColor(rol)}
                    textColor="white"
                    style={styles.roleButton}
                  >
                    {rol}
                  </Button>
                }
              >
                {roles.map((roleOption) => (
                  <Menu.Item
                    key={roleOption}
                    onPress={() => {
                      setRol(roleOption);
                      setMenuVisible(false);
                    }}
                    title={roleOption}
                    titleStyle={{ color: getRoleColor(roleOption) }}
                  />
                ))}
              </Menu>
            </View>

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleCrearColaborador}
                buttonColor={colors.primary}
                textColor="white"
                style={styles.createButton}
              >
                Crear Colaborador
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                textColor={colors.primary}
                style={[styles.cancelButton, { borderColor: colors.primary }]}
              >
                Cancelar
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleButton: {
    minWidth: 100,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  createButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
});
