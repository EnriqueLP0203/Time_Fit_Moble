import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Función de login
  const login = async (email, password) => {
    try {
      const res = await fetch('http://192.168.137.1:3000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserToken(data.token);
        setUserInfo(data.user);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      } else {
        throw new Error(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      throw err;
    }
  };


const register = async (name, lastname, username, email, password) => {
  try {
    const res = await fetch('http://192.168.137.1:3000/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastname, username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUserToken(data.token);
      setUserInfo(data.user);
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || 'Error al registrar');
    }
  } catch (err) {
    throw err;
  }
};

  // ✅ Función de logout
  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  // ✅ Al cargar la app, intenta restaurar sesión
  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');
      if (token && user) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
      }
    } catch (e) {
      console.log('Error al recuperar sesión', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
