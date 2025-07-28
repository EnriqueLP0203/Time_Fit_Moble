// src/screen/info/ScreenInfo.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';

export default function ScreenInfo({ route }) {
  const { colors, isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo de edición

  // `route.params` contendrá los datos que pases desde navigation.navigate()
  // Asegúrate de que los nombres de las propiedades (`memberTitle`, `memberSubtitle`) coincidan con los que envías.
  const { memberTitle, memberSubtitle } = route.params || { memberTitle: 'N/A', memberSubtitle: 'N/A' };

  // Datos de formulario (placeholders, no se almacenan en variables de estado aquí)
  // En una implementación real, estos vendrían de props o de una API
  const formData = {
    nombre: "Diego",
    primerApellido: "Balbuena",
    segundoApellido: "Caballero",
    correoElectronico: "diego.b@gmail.com",
    telefono: "984 118 9971",
    telefonoEmergencia: "984 873 1616",
    rfc: "COGH980313XXXX",
    fechaNacimiento: "21/10/2001",
    pais: "México",
    colonia: "Bellavista",
    numeroInterno: "17",
    numeroExterno: "2",
    manzana: "56",
    estado: "Quintana Roo.",
    municipio: "Solidaridad",
    calle: "Av universidades",
    codigoPostal: "77712"
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={[styles.scrollViewContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        {/* Aquí se integra la información de encabezado del Figma */}
        <View style={styles.userInfoTop}>
          <View style={styles.avatarPlaceholder}>
            <IconButton
              icon="account-circle"
              color={colors.text}
              size={50}
            />
          </View>
          <View>
            {/* Usando memberTitle y memberSubtitle si es necesario, o directamente los datos de formData */}
            <Text style={[styles.userName, { color: colors.text }]}>{memberTitle === 'N/A' ? formData.nombre + ' ' + formData.primerApellido : memberTitle}</Text>
            <Text style={[styles.userEmail, { color: colors.text }]}>{memberSubtitle === 'N/A' ? formData.correoElectronico : memberSubtitle}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Botón de Editar/Guardar */}
        <Button
          mode="contained"
          onPress={toggleEditing}
          buttonColor={colors.primary}
          labelStyle={{ color: 'white', fontSize: 16 }}
          style={styles.editButton}
        >
          {isEditing ? "Guardar Cambios" : "Editar Datos"}
        </Button>

        {/* Sección de Datos Generales (del formulario Figma) */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF' }]}>
          <Card.Title
            title="DATOS GENERALES"
            titleStyle={[styles.cardTitle, { color: colors.text }]}
            right={() => (
              <IconButton
                icon="pencil"
                color={colors.text}
                size={20}
                onPress={toggleEditing}
              />
            )}
          />
          <Card.Content>
            <View style={styles.inputRow}>
              <TextInput
                label="Nombre(s)"
                value={formData.nombre}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                editable={isEditing}
              />
              <TextInput
                label="Primer Apellido"
                value={formData.primerApellido}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                editable={isEditing}
              />
            </View>
            <TextInput
              label="Segundo Apellido"
              value={formData.segundoApellido}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
            <TextInput
              label="Correo Electronico"
              value={formData.correoElectronico}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              keyboardType="email-address"
              editable={isEditing}
            />
            <View style={styles.inputRow}>
              <TextInput
                label="Tel."
                value={formData.telefono}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                keyboardType="phone-pad"
                editable={isEditing}
              />
              <TextInput
                label="Tel. de emergencia"
                value={formData.telefonoEmergencia}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>
            <TextInput
              label="RFC"
              value={formData.rfc}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
            <TextInput
              label="Fecha de nacimiento"
              value={formData.fechaNacimiento}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
          </Card.Content>
        </Card>

        {/* Sección de Dirección (del formulario Figma) */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF' }]}>
          <Card.Title
            title="DIRECCIÓN"
            titleStyle={[styles.cardTitle, { color: colors.text }]}
            right={() => (
              <IconButton
                icon="pencil"
                color={colors.text}
                size={20}
                onPress={toggleEditing}
              />
            )}
          />
          <Card.Content>
            <TextInput
              label="País"
              value={formData.pais}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
            <TextInput
              label="Colonia"
              value={formData.colonia}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
            <View style={styles.inputRowTriple}>
              <TextInput
                label="N. Interno"
                value={formData.numeroInterno}
                mode="outlined"
                style={[styles.input, styles.inputThird, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                keyboardType="numeric"
                editable={isEditing}
              />
              <TextInput
                label="N. Externo"
                value={formData.numeroExterno}
                mode="outlined"
                style={[styles.input, styles.inputThird, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                keyboardType="numeric"
                editable={isEditing}
              />
              <TextInput
                label="Mz"
                value={formData.manzana}
                mode="outlined"
                style={[styles.input, styles.inputThird, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                label="Estado"
                value={formData.estado}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                editable={isEditing}
              />
              <TextInput
                label="Municipio"
                value={formData.municipio}
                mode="outlined"
                style={[styles.input, styles.inputHalf, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                editable={isEditing}
              />
            </View>
            <TextInput
              label="Calle(s)"
              value={formData.calle}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              editable={isEditing}
            />
            <TextInput
              label="Código Postal"
              value={formData.codigoPostal}
              mode="outlined"
              style={[styles.input, { backgroundColor: isDarkMode ? '#45474B' : '#F0F0F0' }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              keyboardType="numeric"
              editable={isEditing}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  userInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc', // Color de fondo para el avatar si no hay imagen
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  editButton: {
    marginVertical: 15,
    borderRadius: 8,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
    borderRadius: 8,
  },
  inputHalf: {
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputThird: {
    flex: 1,
    marginRight: 8,
  },
  inputRowTriple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});