import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authContext';
import { useTheme } from '../../context/ThemeContext';

export default function ScreenHome({ navigation }) {
  const { colors } = useTheme();
  const { userInfo, activeGym, userGyms, loadUserDataWithRetry } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState({
    memberships: false,
    customers: false,
    revenue: false,
    activity: false
  });

  useEffect(() => {
    console.log('🔄 Home montado, recargando datos...');
    loadUserDataWithRetry();
  }, []);

  useEffect(() => {
    console.log('📊 Datos del home actualizados:');
    console.log('👤 Usuario:', userInfo);
    console.log('🏋️ Gym activo:', activeGym ? {
      id: activeGym._id,
      name: activeGym.name,
      membershipsCount: activeGym.memberships ? activeGym.memberships.length : 0,
      customersCount: activeGym.customers ? activeGym.customers.length : 0
    } : 'No hay gym activo');
    
    if (activeGym && activeGym.customers) {
      console.log('👥 Clientes del gym:', activeGym.customers.map(c => ({
        name: c.name,
        membership: c.membership_id ? c.membership_id.nombre : 'Sin membresía',
        status: c.status
      })));
    }
  }, [userInfo, activeGym]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserDataWithRetry();
    setRefreshing(false);
  };

  const toggleCard = (cardName) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardName]: !prev[cardName]
    }));
  };

  const getMembershipStats = () => {
    if (!activeGym || !activeGym.memberships) return { total: 0, active: 0, inactive: 0 };
    
    const total = activeGym.memberships.length;
    const active = activeGym.memberships.filter(m => m.status === 'activo').length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const getCustomerStats = () => {
    if (!activeGym || !activeGym.customers) return { total: 0, active: 0, expired: 0 };
    
    const total = activeGym.customers.length;
    const active = activeGym.customers.filter(c => c.status === 'activo').length;
    const expired = total - active;
    
    return { total, active, expired };
  };

  const getRevenueStats = () => {
    if (!activeGym || !activeGym.customers) {
      console.log('❌ No hay gym activo o clientes disponibles');
      return { 
        total: 0, 
        monthly: 0, 
        average: 0,
        salesByMembership: [],
        totalSales: 0
      };
    }
    
    console.log('🔄 Calculando estadísticas de ingresos...');
    console.log('📊 Clientes disponibles:', activeGym.customers.length);
    console.log('📋 Datos de clientes:', activeGym.customers.map(c => ({
      name: c.name,
      membership: c.membership_id ? c.membership_id.nombre : 'Sin membresía',
      price: c.membership_id ? c.membership_id.precio : 0
    })));
    
    // Obtener todas las ventas de membresías
    const sales = activeGym.customers
      .filter(customer => customer.membership_id && customer.membership_id.precio)
      .map(customer => ({
        customerName: `${customer.name} ${customer.lastname}`,
        membershipName: customer.membership_id.nombre,
        membershipPrice: customer.membership_id.precio,
        membershipDuration: customer.membership_id.duracion,
        saleDate: customer.createdAt || new Date()
      }));
    
    console.log('💰 Ventas encontradas:', sales.length);
    console.log('📈 Detalles de ventas:', sales);
    
    // Calcular total de ingresos
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.membershipPrice, 0);
    
    // Calcular ingresos del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.membershipPrice, 0);
    
    // Calcular promedio por venta
    const averageRevenue = sales.length > 0 ? totalRevenue / sales.length : 0;
    
    // Agrupar ventas por membresía
    const salesByMembership = {};
    sales.forEach(sale => {
      if (!salesByMembership[sale.membershipName]) {
        salesByMembership[sale.membershipName] = {
          name: sale.membershipName,
          price: sale.membershipPrice,
          duration: sale.membershipDuration,
          quantity: 0,
          total: 0
        };
      }
      salesByMembership[sale.membershipName].quantity += 1;
      salesByMembership[sale.membershipName].total += sale.membershipPrice;
    });
    
    const salesByMembershipArray = Object.values(salesByMembership);
    
    console.log('📊 Estadísticas finales:', {
      total: totalRevenue,
      monthly: monthlyRevenue,
      average: averageRevenue,
      totalSales: sales.length,
      salesByMembership: salesByMembershipArray
    });
    
    return { 
      total: totalRevenue, 
      monthly: monthlyRevenue, 
      average: averageRevenue,
      salesByMembership: salesByMembershipArray,
      totalSales: sales.length
    };
  };

  const getActivityStats = () => {
    if (!activeGym || !activeGym.customers) return { recent: 0, thisMonth: 0, thisWeek: 0 };
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisWeek = Math.floor(now.getDate() / 7);
    
    const recentActivity = activeGym.customers.filter(c => {
      const customerDate = new Date(c.createdAt);
      return customerDate.getMonth() === thisMonth;
    }).length;
    
    const thisMonthActivity = recentActivity;
    const thisWeekActivity = Math.floor(recentActivity * 0.25); // Estimación
    
    return { 
      recent: recentActivity, 
      thisMonth: thisMonthActivity, 
      thisWeek: thisWeekActivity 
    };
  };

  const membershipStats = getMembershipStats();
  const customerStats = getCustomerStats();
  const revenueStats = getRevenueStats();
  const activityStats = getActivityStats();

  // Si no hay gym activo, mostrar mensaje para crear uno
  if (!activeGym) {
    return (
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              ¡Hola, {userInfo?.name || 'Usuario'}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Bienvenido a TimeFit
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="person-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* No Gym Message */}
        <View style={styles.noGymContainer}>
          <Ionicons name="barbell-outline" size={64} color={colors.primary} />
          <Text style={[styles.noGymTitle, { color: colors.text }]}>
            Bienvenido a TimeFit
          </Text>
          <Text style={[styles.noGymSubtitle, { color: colors.textSecondary }]}>
            Para comenzar a gestionar tus membresías y clientes, crea tu primer gimnasio
          </Text>
          
          <TouchableOpacity
            style={[styles.createGymButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CrearGym')}
          >
            <Text style={styles.createGymButtonText}>Crear mi primer gimnasio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            ¡Hola, {userInfo?.name || 'Usuario'}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {activeGym ? activeGym.name : 'Sin gimnasio activo'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Ionicons name="person-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {/* Memberships Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => toggleCard('memberships')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="card" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Membresías</Text>
            </View>
            <Ionicons 
              name={expandedCards.memberships ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </View>
          
          <View style={styles.cardContent}>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {membershipStats.total}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              Total de membresías
            </Text>
          </View>

          {expandedCards.memberships && (
            <View style={styles.expandedContent}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Activas:</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {membershipStats.active}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inactivas:</Text>
                <Text style={[styles.statValue, { color: colors.error }]}>
                  {membershipStats.inactive}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CrearMembresia')}
              >
                <Text style={styles.actionButtonText}>Crear Membresía</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Customers Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => toggleCard('customers')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Clientes</Text>
            </View>
            <Ionicons 
              name={expandedCards.customers ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </View>
          
          <View style={styles.cardContent}>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {customerStats.total}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              Total de clientes
            </Text>
          </View>

          {expandedCards.customers && (
            <View style={styles.expandedContent}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Activos:</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {customerStats.active}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expirados:</Text>
                <Text style={[styles.statValue, { color: colors.error }]}>
                  {customerStats.expired}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CrearCliente')}
              >
                <Text style={styles.actionButtonText}>Agregar Cliente</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Revenue Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => toggleCard('revenue')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="cash" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Ingresos</Text>
            </View>
            <Ionicons 
              name={expandedCards.revenue ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </View>
          
          <View style={styles.cardContent}>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              ${revenueStats.total.toLocaleString()}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              {revenueStats.totalSales} ventas realizadas
            </Text>
          </View>

          {expandedCards.revenue && (
            <View style={styles.expandedContent}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Este mes:</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  ${revenueStats.monthly.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Promedio por venta:</Text>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  ${revenueStats.average.toLocaleString()}
                </Text>
              </View>
              
              {revenueStats.salesByMembership.length > 0 && (
                <View style={[styles.salesBreakdown, { borderTopColor: colors.border }]}>
                  <Text style={[styles.breakdownTitle, { color: colors.text }]}>
                    Ventas por membresía:
                  </Text>
                  {revenueStats.salesByMembership.map((sale, index) => (
                    <View key={index} style={styles.saleItem}>
                      <View style={styles.saleInfo}>
                        <Text style={[styles.saleName, { color: colors.text }]}>
                          {sale.name}
                        </Text>
                        <Text style={[styles.saleDetails, { color: colors.textSecondary }]}>
                          {sale.quantity} vendidas • ${sale.price} c/u • {sale.duration} días
                        </Text>
                      </View>
                      <Text style={[styles.saleTotal, { color: colors.success }]}>
                        ${sale.total.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {revenueStats.totalSales === 0 && (
                <View style={styles.noSalesContainer}>
                  <Ionicons name="cart-outline" size={24} color={colors.textSecondary} />
                  <Text style={[styles.noSalesText, { color: colors.textSecondary }]}>
                    No hay ventas registradas
                  </Text>
                  <Text style={[styles.noSalesSubtext, { color: colors.textSecondary }]}>
                    Los ingresos aparecerán cuando registres clientes con membresías
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Activity Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => toggleCard('activity')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Actividad</Text>
            </View>
            <Ionicons 
              name={expandedCards.activity ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </View>
          
          <View style={styles.cardContent}>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {activityStats.recent}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              Actividad reciente
            </Text>
          </View>

          {expandedCards.activity && (
            <View style={styles.expandedContent}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Este mes:</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {activityStats.thisMonth}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Esta semana:</Text>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  {activityStats.thisWeek}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  migrationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noGymContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  noGymTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noGymSubtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  createGymButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  createGymButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  salesBreakdown: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  saleInfo: {
    flex: 1,
  },
  saleName: {
    fontSize: 14,
    fontWeight: '600',
  },
  saleDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  saleTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noSalesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noSalesText: {
    fontSize: 16,
    marginTop: 10,
  },
  noSalesSubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});
