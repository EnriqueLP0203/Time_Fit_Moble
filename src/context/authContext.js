import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsGym, setNeedsGym] = useState(false);
  const [activeGym, setActiveGym] = useState(null);
  const [userGyms, setUserGyms] = useState([]);

  // ✅ Función de login
  const login = async (email, password) => {
    try {
      console.log('🔄 Iniciando login...');
      const res = await fetch('http://192.168.137.1:3000/api/user/login', { //llamar a la api de login en el backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('📥 Respuesta del servidor:', data);

      if (res.ok) {
        console.log('✅ Login exitoso, configurando sesión...');
        
        // Establecer el token primero
        setUserToken(data.token);
        await AsyncStorage.setItem('userToken', data.token);

        const userData = {
          ...data.user,
          hasGym: data.hasGym,
          gym: data.gym
        };
        setUserInfo(userData);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        
        console.log('🏋️ Estado del gym:', {
          hasGym: data.hasGym,
          gym: data.gym ? data.gym.name : 'No hay gym'
        });
        
        // Verificar si necesita crear un gym
        if (!data.hasGym) {
          console.log('❌ Usuario no tiene gym, estableciendo needsGym = true');
          setNeedsGym(true);
          setActiveGym(null);
          setUserGyms([]);
        } else {
          console.log('✅ Usuario tiene gym, cargando datos completos...');
          setNeedsGym(false);
          
          // Cargar datos completos del usuario
          const success = await loadUserDataWithRetry();
          if (!success) {
            console.log('⚠️ No se pudieron cargar los datos completos, pero el usuario tiene gym');
            // Si no se pueden cargar los datos pero sabemos que tiene gym, no cambiar needsGym
          }
        }
      } else {
        console.log('❌ Error en login:', data.message);
        throw new Error(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.log('❌ Error en login:', err.message);
      throw err;
    }
  };

//funcion de registro de usuario
const register = async (name, lastname, username, email, password) => {
  try {
    console.log('🔄 Iniciando registro...');
    console.log('📤 Datos a enviar:', { name, lastname, username, email, password: '***' });
    console.log('🌐 URL del servidor: http://192.168.137.1:3000/api/user/register');
    
    const res = await fetch('http://192.168.137.1:3000/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastname, username, email, password }),
    });

    console.log('📥 Status de respuesta:', res.status);
    const data = await res.json();
    console.log('📥 Respuesta del servidor:', data);

    if (res.ok) {
      console.log('✅ Registro exitoso, configurando sesión...');
      
      // Establecer el token primero
      setUserToken(data.token);
      await AsyncStorage.setItem('userToken', data.token);

      const userData = {
        ...data.user,
        hasGym: false, // Usuario nuevo empieza sin gym
        gym: null
      };
      
      // Establecer la información del usuario
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      
      // Configurar estado inicial para usuario nuevo
      setNeedsGym(false);
      setActiveGym(null);
      setUserGyms([]);
      
      console.log('🔄 Usuario registrado, estado configurado:', {
        token: data.token ? 'Presente' : 'Ausente',
        userInfo: userData.name,
        needsGym: false,
        activeGym: null
      });
      
      // Forzar actualización del estado
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setLoading(false);
      
      console.log('✅ Registro completado exitosamente');
    } else {
      console.log('❌ Error en registro:', data.message);
      throw new Error(data.message || 'Error al registrar');
    }
  } catch (err) {
    console.log('❌ Error en registro:', err.message);
    throw err;
  }
};

  // ✅ Función de logout
  const logout = async () => {
    console.log('🚪 Iniciando logout...');
    
    // Limpiar todos los estados
    setUserToken(null);
    setUserInfo(null);
    setNeedsGym(false);
    setActiveGym(null);
    setUserGyms([]);
    setLoading(false);
    
    // Limpiar AsyncStorage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    
    console.log('✅ Logout completado, estado limpiado');
  };

  // ✅ Función para cargar datos con reintentos
  const loadUserDataWithRetry = async (maxRetries = 3, delay = 500) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Intento ${attempt} de ${maxRetries} para cargar datos...`);
      
      const success = await loadUserDataRobustly();
      if (success) {
        console.log('✅ Datos cargados exitosamente');
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log('❌ No se pudieron cargar los datos después de todos los intentos');
    return false;
  };

  // ✅ Función para cargar datos de forma robusta
  const loadUserDataRobustly = async () => {
    try {
      // Verificar que el token esté disponible
      if (!userToken) {
        console.log('⏳ Token no disponible, esperando...');
        return false;
      }

      console.log('🔍 Cargando información del usuario de forma robusta...');
      console.log('Token:', userToken ? 'Presente' : 'Ausente');
      console.log('Token length:', userToken ? userToken.length : 0);
      
      const res = await fetch('http://192.168.137.1:3000/api/user/info', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      const data = await res.json();
      console.log('📡 Respuesta del servidor:', JSON.stringify(data, null, 2));

      if (res.ok) {
        console.log('✅ Datos cargados correctamente');
        console.log('Gyms encontrados:', data.gyms?.length || 0);
        console.log('Gym activo:', data.activeGym ? 'Sí' : 'No');
        console.log('User data:', data.user ? 'Presente' : 'No');
        
        setUserGyms(data.gyms || []);
        setActiveGym(data.activeGym);
        
        // Actualizar userInfo con la información completa
        const updatedUserInfo = {
          ...userInfo,
          ...data.user,
          hasGym: data.gyms && data.gyms.length > 0,
          gym: data.activeGym
        };
        setUserInfo(updatedUserInfo);
        await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        
        // Solo actualizar needsGym si no tenemos información previa del gym
        // Si userInfo.hasGym es true, no cambiar needsGym
        if (userInfo && userInfo.hasGym) {
          console.log('✅ Usuario ya tiene gym confirmado, manteniendo needsGym = false');
          setNeedsGym(false);
        } else {
          // Actualizar needsGym basado en si tiene gyms
          const hasGyms = data.gyms && data.gyms.length > 0;
          setNeedsGym(!hasGyms);
          console.log('🔄 NeedsGym actualizado a:', !hasGyms);
        }
        
        console.log('Estado final - userGyms:', data.gyms?.length || 0);
        console.log('Estado final - activeGym:', data.activeGym ? data.activeGym.name : 'No');
        return true;
      } else {
        console.log('❌ Error en la respuesta:', data.message);
        console.log('Status code:', res.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Error al cargar información del usuario:', error);
      return false;
    }
  };

  // ✅ Cargar información completa del usuario
  const loadUserInfo = async () => {
    return await loadUserDataRobustly();
  };

  // ✅ Cambiar gym activo
  const changeActiveGym = async (gymId) => {
    try {
      const res = await fetch('http://192.168.137.1:3000/api/user/change-active-gym', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ gymId }),
      });

      const data = await res.json();

      if (res.ok) {
        setActiveGym(data.activeGym);
        
        // Actualizar userInfo con el nuevo gym activo
        const updatedUserInfo = {
          ...userInfo,
          active_gym_id: gymId,
          gym: data.activeGym
        };
        setUserInfo(updatedUserInfo);
        await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // ✅ Función para actualizar userInfo después de crear gym
  const updateUserInfoAfterGymCreation = async (gymData) => {
    try {
      console.log('🔄 Actualizando información después de crear gym...');
      
      // Usar la función robusta para cargar datos
      const success = await loadUserDataWithRetry();
      
      if (success) {
        console.log('✅ Información actualizada correctamente después de crear gym');
        
        // Si no hay gym activo, establecer el recién creado como activo
        if (!activeGym && gymData) {
          console.log('🔄 Estableciendo gym recién creado como activo...');
          await changeActiveGym(gymData._id);
        }
      } else {
        console.log('❌ Error al actualizar información después de crear gym');
      }
    } catch (error) {
      console.log('Error al actualizar información después de crear gym:', error);
    }
  };

  // ✅ Función para refrescar datos del usuario (útil después de operaciones CRUD)
  const refreshUserData = async () => {
    try {
      await loadUserDataWithRetry();
    } catch (error) {
      console.log('Error al refrescar datos del usuario:', error);
    }
  };

  // ✅ Al cargar la app, intenta restaurar sesión
  const isLoggedIn = async () => {
    try {
      console.log('🔄 Verificando sesión guardada...');
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');
      
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      console.log('User info encontrado:', user ? 'Sí' : 'No');
      
      if (token && user) {
        const userData = JSON.parse(user);
        console.log('📱 Restaurando sesión del usuario:', userData.name);
        
        // Establecer el token primero
        setUserToken(token);
        setUserInfo(userData);
        
        // Esperar un momento para que el estado se actualice antes de cargar info
        setTimeout(async () => {
          console.log('🔄 Cargando información completa...');
          await loadUserDataWithRetry();
        }, 100);
      } else {
        console.log('❌ No hay sesión guardada');
      }
    } catch (e) {
      console.log('❌ Error al recuperar sesión:', e);
    } finally {
      setLoading(false);
      console.log('✅ Verificación de sesión completada');
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  // Recargar datos cuando el token cambie (excepto durante el login inicial)
  useEffect(() => {
    if (userToken && userInfo && !loading) {
      // Solo recargar si ya tenemos userInfo (no es el login inicial)
      loadUserDataWithRetry();
    }
  }, [userToken]);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        setUserInfo,
        login,
        logout,
        register,
        loading,
        needsGym,
        setNeedsGym,
        activeGym,
        userGyms,
        loadUserInfo,
        loadUserDataWithRetry,
        changeActiveGym,
        updateUserInfoAfterGymCreation,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
