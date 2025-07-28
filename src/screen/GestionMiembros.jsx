import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Avatar, Card, Checkbox, Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext'; // Asumiendo que este context existe en tu proyecto

export default function Colaboradores() {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const { colors, isDarkMode } = useTheme(); // Usando el contexto de tema

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (isSelecting) {
      setChecked(false); // Resetear checkbox al cancelar
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
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

      <Card style={[styles.card, { backgroundColor: isDarkMode ? '#45474B' : colors.card }]}>
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
                    onPress={() => console.log('Botón Info presionado')}
                    textColor={colors.primary}
                    style={[styles.button, { borderColor: colors.primary, borderWidth: 0.8 }]}
                    labelStyle={[styles.buttonLabel, { color: colors.primary }]}
                    compact={true}
                  >
                    Info
                  </Button>
                  <Button
                    mode="contained"
                    onPress={toggleActive}
                    buttonColor={isActive ? colors.primary : "#666666"}
                    labelStyle={[styles.buttonLabel, { color: 'white' }]}
                    style={styles.button}
                    compact={true}
                  >
                    {isActive ? "On" : "Off"}
                  </Button>
                </>
              )}
            </View>
          )}
        />
      </Card>
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
});