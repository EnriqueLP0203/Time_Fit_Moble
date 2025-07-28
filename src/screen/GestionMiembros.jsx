// GestionMiembros.jsx
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar, Card, Checkbox, Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function GestionMiembros() {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [isInfoModalVisible, setIsInfoModalVisible] = React.useState(false);

  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (isSelecting) {
      setChecked(false);
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const openInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  // Función para navegar a la pantalla de información detallada DESDE EL MODAL
  const navigateToMemberInfoScreenFromModal = () => {
    closeInfoModal(); // Primero cierra el modal
    navigation.navigate('Info', {
      memberTitle: "Nombre Miembro Completo", // Datos de ejemplo para la pantalla
      memberSubtitle: "Detalles del Plan",    // Datos de ejemplo para la pantalla
    });
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
      </View>

      <Card
        style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card }]}
        // ELIMINADO: onPress={navigateToMemberInfoScreen}
        // La Card ya no navegará a la pantalla completa al hacer click
      >
        <Card.Title
          title="Card Title"
          titleStyle={[styles.title, { color: colors.text, marginLeft: isSelecting ? 40 : 0 }]}
          subtitle="Card Subtitle"
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
                icon="account"
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
                    onPress={toggleActive}
                    buttonColor={isActive ? colors.primary : "#757575"}
                    labelStyle={[styles.buttonLabel, { color: 'white', fontWeight: '600' }]}
                    style={styles.button}
                    compact={true}
                  >
                    {isActive ? "Activo" : "Inactivo"}
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Información Breve del Miembro</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Nombre: [Nombre del Miembro]</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Estado: [Activo/Inactivo]</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Último pago: [Fecha]</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Membresía: [Tipo]</Text>

            <Button
              mode="contained"
              onPress={navigateToMemberInfoScreenFromModal} // ¡Este botón ahora navega a la pantalla completa!
              buttonColor={colors.primary}
              labelStyle={{ color: 'white' }}
              style={styles.modalButton}
            >
              Ver Detalles
            </Button>
            <Button
              mode="text" // Añadimos un botón de cerrar el modal sin navegar
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