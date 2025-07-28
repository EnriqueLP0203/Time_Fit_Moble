import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CrearMembresia() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');

  const handleGuardar = () => {
    console.log({ nombre, descripcion, precio, duracion });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear membresia</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#fff"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripcion"
        placeholderTextColor="#fff"
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#fff"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <TextInput
        style={styles.input}
        placeholder="Duracion"
        placeholderTextColor="#fff"
        value={duracion}
        onChangeText={setDuracion}
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FF6A00',
    borderRadius: 6,
    padding: 10,
    color: '#fff',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    width: '45%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
  },
  saveBtn: {
    backgroundColor: '#9C4500',
    padding: 10,
    borderRadius: 6,
    width: '45%',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
