// screens/HomeScreen/alumno/MisSolicitudes.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MisSolicitudes({ navigation }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = más reciente, 'asc' = más antiguo
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Fetch solicitudes from API
  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      
      // Obtener el perfil_id del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'No se encontró información del usuario');
        return;
      }

      // Hacer la llamada a la API
      const response = await fetch(``);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verificar si hay error en la respuesta
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Mapear los datos al formato esperado por la interfaz
      const solicitudesMapeadas = data.map(item => ({
        id: item.postulacion_id,
        titulo: item.titulo,
        estado: item.estado_postulacion,
        fecha_postulacion: item.fecha_postulacion,
        // Información adicional que podríamos usar
        vacante_id: item.vacante_id,
        categoria: item.categoria,
        tipo: item.tipo,
        carrera: item.carrera,
        ciudad: item.ciudad,
        modalidad: item.modalidad,
        empresa_id: item.empresa_id,
        estado_vacante: item.estado_vacante,
        descripcion: item.descripcion,
        salario_minimo: item.salario_minimo,
        salario_maximo: item.salario_maximo,
        salario_fijo: item.salario_fijo,
        tipo_pago: item.tipo_pago,
        moneda: item.moneda,
      }));
      
      setSolicitudes(solicitudesMapeadas);
      setFilteredSolicitudes(solicitudesMapeadas);
      
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      Alert.alert(
        'Error', 
        'No se pudieron cargar las solicitudes. Verifique su conexión a internet.',
        [
          { text: 'Reintentar', onPress: () => fetchSolicitudes() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Filter and sort solicitudes
  useEffect(() => {
    let filtered = solicitudes;

    // Filter by search text
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(solicitud =>
        solicitud.titulo.toLowerCase().includes(searchLower) ||
        solicitud.categoria?.toLowerCase().includes(searchLower) ||
        solicitud.ciudad?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_postulacion);
      const dateB = new Date(b.fecha_postulacion);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredSolicitudes(filtered);
  }, [searchText, sortOrder, solicitudes]);

  // Get status badge style
  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'pendiente':
        return styles.estadoPendiente;
      case 'leido':
        return styles.estadoLeido;
      case 'aceptado':
        return styles.estadoAceptado;
      case 'rechazado':
        return styles.estadoRechazado;
      default:
        return styles.estadoPendiente;
    }
  };

  // Get status text
  const getStatusText = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'leido':
        return 'Leído';
      case 'aceptado':
        return 'Aceptado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Handle card press - navegar a detalles de la vacante
  const handleCardPress = (solicitud) => {
    navigation.navigate('DetallesVacante', { 
      vacanteId: solicitud.vacante_id,
      fromSolicitudes: true 
    });
  };

  // Render solicitud card
  const renderSolicitudCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.solicitudCard}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.solicitudHeader}>
        <Text style={styles.solicitudTitulo}>{item.titulo}</Text>
        {item.ciudad && (
          <Text style={styles.solicitudCiudad}>{item.ciudad}</Text>
        )}
      </View>
      
      {item.categoria && (
        <Text style={styles.solicitudCategoria}>{item.categoria}</Text>
      )}
      
      <View style={styles.solicitudInfo}>
        <View style={[styles.estadoBadge, getStatusStyle(item.estado)]}>
          <Text style={styles.estadoText}>{getStatusText(item.estado)}</Text>
        </View>
        <Text style={styles.solicitudFecha}>{formatDate(item.fecha_postulacion)}</Text>
      </View>
      
      {item.modalidad && (
        <Text style={styles.solicitudModalidad}>Modalidad: {item.modalidad}</Text>
      )}
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No hay solicitudes</Text>
      <Text style={styles.emptySubtitle}>
        {searchText ? 'No se encontraron solicitudes que coincidan con tu búsqueda.' : 'No has realizado ninguna solicitud aún.'}
      </Text>
      {!searchText && (
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => navigation.navigate('AlumnoInicio')}
        >
          <Text style={styles.exploreButtonText}>Explorar Vacantes</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Solicitudes</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchSolicitudes}
        >
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, categoría o ciudad"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Sort */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por</Text>
          <TouchableOpacity 
            style={styles.sortSelector}
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Text style={styles.sortText}>
              {sortOrder === 'desc' ? 'Más reciente' : 'Más antiguo'}
            </Text>
            {showSortOptions ? (
              <ChevronUp size={16} color="#6b7280" />
            ) : (
              <ChevronDown size={16} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        {showSortOptions && (
          <View style={styles.sortOptions}>
            <TouchableOpacity 
              style={styles.sortOption}
              onPress={() => {
                setSortOrder('desc');
                setShowSortOptions(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortOrder === 'desc' && styles.sortOptionSelected]}>
                Más reciente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sortOption}
              onPress={() => {
                setSortOrder('asc');
                setShowSortOptions(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortOrder === 'asc' && styles.sortOptionSelected]}>
                Más antiguo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Solicitudes List */}
      <FlatList
        data={filteredSolicitudes}
        renderItem={renderSolicitudCard}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchSolicitudes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f5f7ff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  sortSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    minWidth: 180,
    justifyContent: 'space-between',
  },
  sortText: {
    fontSize: 14,
    color: '#000000',
  },
  sortOptions: {
    position: 'absolute',
    top: '100%',
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1001,
    minWidth: 180,
    marginTop: 5,
  },
  sortOption: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  sortOptionSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  solicitudCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  solicitudHeader: {
    marginBottom: 8,
  },
  solicitudTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  solicitudCiudad: {
    fontSize: 14,
    color: '#6b7280',
  },
  solicitudCategoria: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 12,
    fontWeight: '500',
  },
  solicitudInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  estadoPendiente: {
    backgroundColor: '#f3f4f6',
  },
  estadoLeido: {
    backgroundColor: '#dbeafe',
  },
  estadoAceptado: {
    backgroundColor: '#dcfce7',
  },
  estadoRechazado: {
    backgroundColor: '#fee2e2',
  },
  solicitudFecha: {
    fontSize: 12,
    color: '#6b7280',
  },
  solicitudModalidad: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});