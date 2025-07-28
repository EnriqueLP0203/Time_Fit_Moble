import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar, Card, Checkbox, Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function Colaboradores() {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [colaboradorRole, setColaboradorRole] = React.useState('Admin'); // Estado para el rol
  const [isInfoModalVisible, setIsInfoModalVisible] = React.useState(false);

  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (isSelecting) {
      setChecked(false);
    }
  };

  const toggleRole = () => {
    // Cicla entre diferentes roles
    const roles = ['Admin', 'Manager', 'Staff', 'Trainee'];
    const currentIndex = roles.indexOf(colaboradorRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    setColaboradorRole(roles[nextIndex]);
  };

  const openInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  // Función para navegar a la pantalla de información detallada DESDE EL MODAL
  const navigateToColaboradorInfoScreenFromModal = () => {
    closeInfoModal();
    navigation.navigate('Info', {
      memberTitle: "Nombre Colaborador Completo",
      memberSubtitle: `Rol: ${colaboradorRole}`,
    });
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#E53E3E'; // Rojo
      case 'Manager': return '#3182CE'; // Azul
      case 'Staff': return '#38A169'; // Verde
      case 'Trainee': return '#D69E2E'; // Amarillo
      default: return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Button
          mode="contained"
          onPress={toggleSelectionMode}
          buttonColor={isSelecting ? "#F44336" : colors.primary}
          labelStyle={[styles.headerButtonLabel, { color: '#fff' }]}
          style={styles.headerButton}
        >
          {isSelecting ? "Cancelar" : "Seleccionar"}
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('CrearColaborador')}
          textColor={colors.primary}
          style={[styles.headerButton, { borderColor: colors.primary, borderWidth: 1.5 }]}
          labelStyle={[styles.headerButtonLabel, { color: colors.primary }]}
        >
          Nuevo
        </Button>
      </View>

      <Card
        style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card }]}
      >
        <Card.Title
          title="Colaborador Name"
          titleStyle={[styles.title, { color: colors.text, marginLeft: isSelecting ? 40 : 0 }]}
          subtitle="Detalles del colaborador"
          subtitleStyle={[styles.subtitle, { color: colors.text, marginLeft: isSelecting ? 40 : 0 }]}
          left={(props) => (
            <View style={styles.leftContainer}>
              {isSelecting && (
                <View style={[styles.checkboxContainer, { borderColor: colors.border }]}>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!checked)}
                    color={colors.primary}
                    uncheckedColor={colors.text}
                  />
                </View>
              )}
              <Avatar.Icon
                {...props}
                icon="account-tie"
                size={32}
                style={[styles.avatar, { marginLeft: isSelecting ? 8 : 0 }]}
                color={colors.text}
                backgroundColor={colors.border}
              />
            </View>
          )}
          right={() => (
            <View style={styles.buttonsContainer}>
              {!isSelecting && (
                <>
                  <Button
                    mode="outlined"
                    onPress={openInfoModal}
                    textColor={colors.primary}
                    style={[styles.button, { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: colors.background }]}
                    labelStyle={[styles.buttonLabel, { color: colors.primary, fontWeight: '600' }]}
                    compact={true}
                  >
                    Info
                  </Button>
                  <Button
                    mode="contained"
                    onPress={toggleRole}
                    buttonColor={getRoleColor(colaboradorRole)}
                    labelStyle={[styles.buttonLabel, { color: 'white', fontWeight: '600' }]}
                    style={styles.button}
                    compact={true}
                  >
                    {colaboradorRole}
                  </Button>
                </>
              )}
            </View>
          )}
        />
      </Card>

      {/* --- EL COMPONENTE MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInfoModalVisible}
        onRequestClose={closeInfoModal}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Información del Colaborador</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Nombre: [Nombre del Colaborador]</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Rol: {colaboradorRole}</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Último acceso: [Fecha]</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Departamento: [Área]</Text>

            <Button
              mode="contained"
              onPress={navigateToColaboradorInfoScreenFromModal}
              buttonColor={colors.primary}
              labelStyle={{ color: 'white' }}
              style={styles.modalButton}
            >
              Ver Detalles
            </Button>
            <Button
              mode="text"
              onPress={closeInfoModal}
              textColor={colors.primary}
              labelStyle={{ fontSize: 14 }}
              style={{ marginTop: 10 }}
            >
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    borderRadius: 8,
    width: 120,
  },
  headerButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    marginBottom: 12,
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 16,
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
    paddingRight: 8,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 4,
    minWidth: 80,
    height: 28,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0,
    textAlign: 'center',
  },
  // --- Estilos para el Modal ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    borderWidth: 1,
  },
  modalTitle: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});