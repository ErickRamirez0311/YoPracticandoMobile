import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator,
    Image,
    StatusBar,
    Dimensions,
} from 'react-native';

import {
    Search,
    Filter,
    Heart,
    Building2,
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Star,
    X,
    Calendar,
    Tag,
} from  'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { text } from "express";

const { width } = Dimensions.get('window');
const API_BASE_URL ='';

export default function Favoritos({ navigation }) {
    const [favoritos, setFavoritos] = useState([]);
    const [filteredFavoritos, setFilteredFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos', 'empresa', 'vacante'
    const [showFilters, setShowFilters] = useState(false);
    const [contadores, setContadores] = useState({
        empresas: 0,
        vacantes: 0,
        total: 0
  });
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userType: null
  });

  //Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  //Cargar favoritos cuando se obtienen los datos del usuario
  useEffect(() => {
    if (userInfo.userId) {
        fetchFavoritos();
    }
  }, [userInfo.userId, filtroActivo]);

  //Aplicar filtros cuando cambian los datos
  useEffect(() => {
    aplicarFiltros();
  }, [searchText, filtroActivo, favoritos]);

  const cargarDatosUsuario = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');

        if (userId && user) {
            setUserInfo({
                userId: parseInt(userId),
                userType: userType
            });
        } else {
            Alert.alert('Error', 'No se encontraron datos de usuario');
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        Alert.alert('Error', 'Error al cargar datos del usuario');
    }
  };

  const fetchFavoritos = async () => {
    if (!userInfo.userId) return;

    try {
        const tipoParam = filtroActivo === 'todos' ? '' : `&tipo=${filtroActivo}`;
        const url = ``;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            setFavoritos(data.favoritos || []);
            setContadores(data.contadores || { empresas: 0, vacantes: 0, total: 0 });
        } else {
            Alert.alert('Error', data.message || 'Error al cargar favoritos');
            setFavoritos([]);
        }
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        Alert.alert('Error', 'No se pudo conectar con ek servidor');
        setFavoritos([]);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  const aplicarFiltros = useCallback(() => {
    let filtered = favoritos;

    //Filtro por texto de busqueda
    if (searchText.trim() !== '') {
        const searchLower = searchText.toLowerCase();
        filtered = filtered.filter(item => {
            if (item.tipo === 'empresa') {
                return (
                    item.nombre_empresa?.toLowerCase().includes(searchLower) ||
                    item.empresa_descripcion?.toLowerCase().includes(searchLower) ||
                    item.ubicacion?.toLowerCase().includes(searchLower)
                );
            } else if (item.tipo === 'vacante') {
                return (
                    item.titulo?.toLowerCase().includes(searchLower) ||
                    item.descripcion?.toLowerCase().includes(searchLower) ||
                    item.nombre_empresa?.toLowerCase().includes(searchLower) ||
                    item.ciudad?.toLowerCase().includes(searchLower) ||
                    item.categoria?.toLowerCase().includes(searchLower)
                );
            }
            return false;
        });
    }
    setFilteredFavoritos(filtered);
  }, [searchText, favoritos]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavoritos();
  };

  //Limpiar HTML de texto

  const cleanHtml = (text) => {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
  };

  //Formatear modalidad
  const formatModality = (modalidad) => {
    if (!modalidad) return 'Tiempo Completo';
    return modalidad
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');  
  };

  //Obtener iniciales de empresa
  const getCompanyInitials = (nombreEmpresa) => {
    if (!nombreEmpresa) return 'E';
    return nombreEmpresa.charAt(0).toUpperCase();
  };

  //Obtener dias restantes
  const getDaysRemaining = (fechaExpiracion) => {
    if (!fechaExpiracion) return null;

    const today = new Date();
    const expirationDate = new Date(fechaExpiracion);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expirada';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    return `Cierra en ${diffDays} dias`;
  };

  //Formatear salario
  const formatSalary = (item) => {
    if (item.tipo_vacante === 'Servicio Social') return null;

    if (item.tipo_pago === 'rango') {
        const min = parseFloat(item.salario_minimo || 0);
        const max = parseFloat(item.salario_maximo || 0);

        if (min === 0 && max === 0) {
            return 'Sin remuneracion';
        }

        return `$${salario.toLocalString()} ${item.moneda || 'MXN'}/Mes`;
    }

    return 'Sin remuneracion';
  };

  //Navegacion a detalles
  const handleItemPress = (item) => {
    if (item.tipo === 'empresa') {
      navigation.navigate('DetallesEmpresa', { empresaId: item.empresa_id });
    } else if (item.tipo === 'vacante') {
      navigation.getParent()?.navigate('DetallesVacante', { vacanteId: item.vacante_id });
    }
  };

  //Mostrar info del favorito (sin permitir quitar por ahora)

  const showFavoritoInfo = (item) => {
    Alert.alert(
      'Favorito',
      `${item.tipo === 'empresa' ? item.nombre_empresa : item.titulo} está en tus favoritos desde el ${new Date(item.fecha_favorito).toLocaleDateString()}`
      [{ text: 'OK' }]
    );
  };

  //Renderizar empresa favorita
  const renderEmpresaCard = (item) => (
    <TouchableOpacity
      style={styles.card} 
      onPress={() => handleItemPress(item)}
      activeOpacity={0.95}
    >
      {/* Boton de favorito */}
      <TouchableOpacity
      style={styles.favoriteButton}
      onPress={() => showFavoritoInfo(item)}
      >
        <Heart size={18} color="#f59e0b" fill="#f59e0b"/>
      </TouchableOpacity>

      {/* Logo de empresa */}
      <View style={styles.companyLogoContainer}>
        <View style={styles.companyLogo}>
          {item.logo ? (
            <Image
            source={{uri: ``}}
            style={styles.companyLogoImage}
            resizeMode="contain"
            />
          ) : (
            <Text style={styles.companyLogoPlaceholder}>
              {getCompanyInitials(item.nombre_empresa)}
            </Text>
          )}
        </View>
      </View>

      {/* Nombre de empresa */}
      <Text style={styles.companyName} numberOfLines={2}>
        {item.nombre_empresa || 'Empresa'}
      </Text>

      {/* Descripcion */}
      <Text style={styles.companyDescription} numberOfLines={3}>
        {cleanHtml(item.empresa_descripcion) || 'Empresa con excelentes oportunidades de crecimiento profesional.'}
      </Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <View style={[styles.tag, styles.tagCompany]}>
          <Building2 size={12} color="#3b82f6"/>
          <Text style={[styles.tagText, { color: '#3b82f6', marginLeft: 4 }]}>Empresa</Text>
        </View>

        {item.ubicacion && (
          <View style={[styles.tag, styles.tagLocation]}>
            <MapPin size={12} color="#0284c7" />
            <Text style={[styles.tagText, {color: '#0284c7', marginLeft: 4}]}>
              {item.ubicacion}
            </Text>
          </View>
        )}

        {item.tamanio_empresa && (
          <View style={[styles.tag, styles.tagSize]}>
            <Text style={[styles.tagText, {color: '#7c3aed'}]}>
              {item.tamanio_empresa}
            </Text>
          </View>
        )}

        {item.activo == 1 && (
          <View style={[styles.tag, styles.tagVerified]}>
            <Star size={12} color="#059669" />
            <Text style={[styles.tagText, { color: '#059669', marginLeft: 4 }]}>Activa</Text>
          </View>
        )}
      </View>

      {/* Meta Info */}
      <View style={styles.metaInfo}>
        <Text style={styles.metaText}>
          Agregado el {new Date(item.fecha_favorito).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  //Renderizar vacante favorita
  const renderVacanteCard = (item) => {
    const daysRemaining = getDaysRemaining(item.fecha_expiracion);
    const isUrgent = daysRemaining && (daysRemaining.includes('hoy') || daysRemaining.includes('mañana'));
    const salary = formatSalary(item);
    const cleanDescription = cleanHtml(item.descripcion);
    const formattedModality = formatModality(item.modalidad);

    return (
      <TouchableOpacity
        style={[styles.card, isUrgent && styles.urgentCard]} 
        onPress={() => handleItemPress(item)}
        activeOpacity={0.95}
      >
        {/* Boton de favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => showFavoritoInfo(item)}
        >
          <Heart size={18} color="#f59e0b" fill="#f59e0b"/>
        </TouchableOpacity>

        {/* Logo de empresa */}
        <View style={styles.companyLogoContainer}>
          <View style={styles.companyLogo}>
            {item.logo ? (
              <Image
                source={{ uri: `` }}
                style={styles.companyLogoImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.companyLogoPlaceholder}>
                {getCompanyInitials(item.nombre_empresa)}
              </Text>
            )}
          </View>
        </View>

        {/* Nombre de empresa */}
        <Text style={styles.companyName} numberOfLines={1}>
          {item.nombre_empresa || 'Empresa'}
        </Text>

        {/* Titulo de vacante */}
        <Text style={styles.vacancyTitle} numberOfLines={2}>
          {item.titulo}
        </Text>

        {/* Descripicion */}
        <Text style={styles.vacancyDescription} numberOfLines={3}>
          {cleanDescription || 'Descripcion no disponible. Este vacante ofrece una excelente oportunidad de crecimiento y aprendizaje.'}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {/* Tipo de vacante */}
          <View style={[styles.tag, styles.tagVacancyType]}>
            <Text style={[styles.tagText, { color: '#e6007e' }]}>
              {item.tipo_vacante || 'Servicio Social'}
            </Text>
          </View>

          {/* Categoria */}
          {item.categoria && (
            <View style={[styles.tag, styles.tagCategory]}>
              <Text style={[styles.tagText, { color: '#3b82f6' }]}>
                {item.categoria}
              </Text>
            </View>
          )}

          {/* Modalidad */}
          <View style={[styles.tag, styles.tagModality]}>
            <Text style={[styles.tagText, { color: '#059669' }]}>
              {formattedModality}
            </Text>
          </View>

          {/* Ubicacion */}
          <View style={[styles.tag, styles.tagLocation]}>
            <Text style={[styles.tagText, { color: '#0284c7' }]}>
              {item.ciudad || 'No especificada'}
            </Text>
          </View>

          {/* Dias restantes */}
          {daysRemaining && (
            <View style={[styles.tag, styles.tagClosing, isUrgent && styles.tagUrgent]}>
              <Text style={[styles.tagText, { color: isUrgent ? "#dc2626" : "#dc2626" }]}>
                {daysRemaining}
              </Text>
            </View>
          )}

          {/* Salario */}
          {salary && (
            <View style={[styles.tag, styles.tagSalary]}>
              <Text style={[styles.tagText, { color: '#d97706' }]}>
                {salary}
              </Text>
            </View>
          )}
        </View>

        {/* Meta info */}
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>
            Agregado el {new Date(item.fecha_favorito).toLocaleDateString()}
          </Text>
        </View>

        {/* Indicador urgente */}
        {isUrgent && (
          <View style={styles.urgentIndicator}>
            <Text style={styles.urgentIndicatorText}>¡URGENTE!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  //Renderizar item
  const renderItem = ({ item }) => {
    return item.tipo === 'empresa' ? renderEmpresaCard(item) : renderVacanteCard(item);
  };

  //Renderizar header
  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Contadores */}
      <View style={styles.countersContainer}>
        <TouchableOpacity
          style={[styles.counterCard, filtroActivo === 'todos' && styles.counterActive]}
          onPress={() => setFiltroActivo('todos')}
        >
          <Text style={[styles.counterNumber, filtroActivo === 'todos' && styles.counterNumberActive]}>
            {contadores.total}
          </Text>
          <Text style={[styles.counterLabel, filtroActivo === 'todos' && styles.counterLabelActive]}>
            Total
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.counterCard, filtroActivo === 'empresa' && styles.counterActive]}
          onPress={() => setFiltroActivo('empresa')}
        >
          <Text style={[styles.counterNumber, filtroActivo === 'empresa' && styles.counterNumberActive]}>
            {contadores.empresas}
          </Text>
          <Text style={[styles.counterLabel, filtroActivo === 'empresa' && styles.counterLabelActive]}>
            Empresas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.counterCard, filtroActivo === 'vacante' && styles.counterActive]}
          onPress={() => setFiltroActivo('vacante')}
        >
          <Text style={[styles.counterNumber, filtroActivo === 'vacante' && styles.counterNumberActive]}>
            {contadores.vacantes}
          </Text>
          <Text style={[styles.counterLabel, filtroActivo === 'vacante' && styles.counterLabelActive]}>
            Vacantes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informacion de resultados */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredFavoritos.length} favorito{filteredFavoritos.length !== 1 ? 's' : ''}
          {filtroActivo !== 'todos' ? ` (${filtroActivo}s)` : ''}
        </Text>
      </View>
    </View>
  );

  //Renderizar estado vacio
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Heart size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>No hay favoritos</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchText ? 'No se encontraron favoritos que coincidan con tu búsqueda' : 'Aún no has agregado elementos a tus favoritos'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return(
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />

      {/* Header fijo */}
      <View style={styles.fixedHeader}>
        <View style={{ height:20 }} />

        <Text style={styles.headerTitle}>Mis Favoritos</Text>

        {/* Barra de busqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#0066ff" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar en favoritos..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Lista de favoritos */}
      <FlatList
      data={filteredFavoritos}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.tipo}-${item.favorito_id}`}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0066ff']}
          tintColor="#0066ff"
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
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
  listContainer: {
    paddingBottom: 20,
  },
  fixedHeader: {
    backgroundColor: '#f5f7ff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listHeader: {
    backgroundColor: '#f5f7ff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  countersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  counterCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  counterActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  counterNumberActive: {
    color: '#ffffff',
  },
  counterLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  counterLabelActive: {
    color: '#ffffff',
  },
  resultsInfo: {
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    position: 'relative',
    alignItems: 'center',
  },
  urgentCard: {
    borderColor: '#fecaca',
    borderWidth: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    zIndex: 1,
  },
  companyLogoContainer: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  companyLogoImage: {
    width: '80%',
    height: '80%',
    maxWidth: 48,
    maxHeight: 48,
  },
  companyLogoPlaceholder: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066ff',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  vacancyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  vacancyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagCompany: {
    backgroundColor: '#dbeafe',
  },
  tagVacancyType: {
    backgroundColor: '#fce7f3',
  },
  tagCategory: {
    backgroundColor: '#dbeafe',
  },
  tagModality: {
    backgroundColor: '#d1fae5',
  },
  tagLocation: {
    backgroundColor: '#e0f2fe',
  },
  tagSalary: {
    backgroundColor: '#fef3c7',
  },
  tagClosing: {
    backgroundColor: '#fee2e2',
  },
  tagUrgent: {
    backgroundColor: '#fecaca',
  },
  tagVerified: {
    backgroundColor: '#d1fae5',
  },
  tagSize: {
    backgroundColor: '#f3e8ff',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaInfo: {
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  urgentIndicator: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
  },
  urgentIndicatorText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});