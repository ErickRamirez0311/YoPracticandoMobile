import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import {
  Search,
  Filter,
  MapPin,
  Heart,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Tag,
  X,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function InicioScreen({ navigation }) {
  const [vacantes, setVacantes] = useState([]);
  const [filteredVacantes, setFilteredVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userType: null
  });
  
  // Filter states
  const [selectedTipoVacante, setSelectedTipoVacante] = useState([]);
  const [selectedModalidad, setSelectedModalidad] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [selectedDiasCierre, setSelectedDiasCierre] = useState([]);

  // Filter options
  const tiposVacante = ['Prácticas', 'Servicio Social'];
  const modalidades = ['Tiempo Completo', 'Medio Tiempo', 'Remoto', 'Hibrido'];
  const categorias = [
    'Económicas y Administrativas',
    'Ciencias Exactas y Naturales',
    'Ingeniería',
    'Ciencias Sociales',
    'Ciencias Biológicas y de Salud',
    'Humanidades y Artes'
  ];

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  // Cargar favoritos cuando se obtienen los datos del usuario
  useEffect(() => {
    if (userInfo.userId) {
      cargarFavoritos();
    }
  }, [userInfo.userId]);

  const cargarDatosUsuario = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userType = await AsyncStorage.getItem('userType');
      
      if (userId && userType) {
        setUserInfo({
          userId: parseInt(userId),
          userType: userType
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  // Cargar favoritos del usuario desde la API
  const cargarFavoritos = async () => {
    if (!userInfo.userId) return;
    
    try {
      const response = await fetch(``);
      const data = await response.json();
      
      if (data.success) {
        const favoritosIds = new Set(data.favoritos.map(fav => fav.vacante_id));
        setFavorites(favoritosIds);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  // Get unique cities from vacantes
  const getCiudades = () => {
    const ciudades = [...new Set(vacantes.map(v => v.ciudad).filter(Boolean))];
    return ciudades.sort();
  };

  // Fetch vacantes from PHP endpoint
  const fetchVacantes = async () => {
    try {
      const response = await fetch('');
      const data = await response.json();
      
      if (data.success) {
        setVacantes(data.vacantes);
        setFilteredVacantes(data.vacantes);
      } else {
        Alert.alert('Error', data.message || 'Error al cargar vacantes');
      }
    } catch (error) {
      console.error('Error fetching vacantes:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVacantes();
  }, []);

  // Clean HTML from text
  const cleanHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim(); // Remove extra whitespace
  };

  // Format modality (remove underscores and capitalize)
  const formatModality = (modalidad) => {
    if (!modalidad) return 'Tiempo Completo';
    return modalidad
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Filter vacantes based on all criteria
  const applyFilters = useCallback(() => {
    let filtered = vacantes;

    // Search text filter
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(vacante =>
        vacante.titulo.toLowerCase().includes(searchLower) ||
        cleanHtml(vacante.descripcion).toLowerCase().includes(searchLower) ||
        vacante.ciudad.toLowerCase().includes(searchLower) ||
        (vacante.nombre_empresa && vacante.nombre_empresa.toLowerCase().includes(searchLower))
      );
    }

    // Tipo vacante filter
    if (selectedTipoVacante.length > 0) {
      filtered = filtered.filter(vacante => 
        selectedTipoVacante.includes(vacante.tipo)
      );
    }

    // Modalidad filter
    if (selectedModalidad.length > 0) {
      filtered = filtered.filter(vacante => 
        selectedModalidad.includes(formatModality(vacante.modalidad))
      );
    }

    // Categoria filter
    if (selectedCategoria) {
      filtered = filtered.filter(vacante => 
        vacante.categoria === selectedCategoria
      );
    }

    // Ciudad filter
    if (selectedCiudad) {
      filtered = filtered.filter(vacante => 
        vacante.ciudad === selectedCiudad
      );
    }

    // Dias cierre filter
    if (selectedDiasCierre.length > 0) {
      filtered = filtered.filter(vacante => {
        const daysRemaining = getDaysRemainingNumber(vacante.fecha_expiracion);
        return selectedDiasCierre.some(rango => {
          if (rango === '7' && daysRemaining < 7) return true;
          if (rango === '15' && daysRemaining >= 7 && daysRemaining <= 15) return true;
          if (rango === '30' && daysRemaining > 15 && daysRemaining <= 30) return true;
          return false;
        });
      });
    }

    setFilteredVacantes(filtered);
  }, [searchText, selectedTipoVacante, selectedModalidad, selectedCategoria, selectedCiudad, selectedDiasCierre, vacantes]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    // Usar setTimeout para evitar que el re-render interfiera con el teclado
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchVacantes();
    if (userInfo.userId) {
      cargarFavoritos();
    }
  };

  // Toggle favorite with API integration
  const toggleFavorite = async (vacante) => {
    if (!userInfo.userId) {
      Alert.alert('Error', 'Necesitas iniciar sesión para agregar favoritos');
      return;
    }

    const wasFavorite = favorites.has(vacante.id);
    
    try {
      if (wasFavorite) {
        // Quitar de favoritos
        const response = await fetch(``, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(vacante.id);
          setFavorites(newFavorites);
        } else {
          Alert.alert('Error', data.message || 'Error al quitar de favoritos');
        }
      } else {
        // Agregar a favoritos
        const response = await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario_id: userInfo.userId,
            item_id: vacante.id,
            tipo: 'vacante'
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          const newFavorites = new Set(favorites);
          newFavorites.add(vacante.id);
          setFavorites(newFavorites);
        } else {
          Alert.alert('Error', data.message || 'Error al agregar a favoritos');
        }
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      Alert.alert('Error', 'No se pudo actualizar el favorito. Intenta de nuevo.');
    }
  };

  // Handle vacancy press
  const handleVacancyPress = (vacante) => {
    // Navigate to vacancy details screen
    // Como estamos dentro de las tabs, necesitamos navegar al stack principal
    navigation.getParent()?.navigate('DetallesVacante', { vacanteId: vacante.id });
  };

  // Format salary
  const formatSalary = (vacante) => {
    if (vacante.tipo === 'Servicio Social') return null;
    
    if (vacante.tipo_pago === 'rango') {
      const min = parseFloat(vacante.salario_minimo || 0);
      const max = parseFloat(vacante.salario_maximo || 0);
      
      if (min === 0 && max === 0) {
        return 'Sin remuneración';
      }
      
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${vacante.moneda || 'MXN'}/Mes`;
    } else if (vacante.salario_fijo) {
      const salario = parseFloat(vacante.salario_fijo);
      
      if (salario === 0) {
        return 'Sin remuneración';
      }
      
      return `$${salario.toLocaleString()} ${vacante.moneda || 'MXN'}/Mes`;
    }
    
    return 'Sin remuneración';
  };

  // Get days remaining
  const getDaysRemaining = (fechaExpiracion) => {
    if (!fechaExpiracion) return null;
    
    const today = new Date();
    const expirationDate = new Date(fechaExpiracion);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expirada';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    return `Cierra en ${diffDays} días`;
  };

  // Get days remaining as number for filtering
  const getDaysRemainingNumber = (fechaExpiracion) => {
    if (!fechaExpiracion) return 999;
    
    const today = new Date();
    const expirationDate = new Date(fechaExpiracion);
    const diffTime = expirationDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get days published
  const getDaysPublished = (fechaPublicacion) => {
    if (!fechaPublicacion) return 0;
    const today = new Date();
    const publishDate = new Date(fechaPublicacion);
    const diffTime = today - publishDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get company initials - MISMA FUNCIÓN QUE EN VACANCYCARD
  const getCompanyInitials = (nombreEmpresa) => {
    if (!nombreEmpresa) return 'E';
    return nombreEmpresa.charAt(0).toUpperCase();
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTipoVacante([]);
    setSelectedModalidad([]);
    setSelectedCategoria('');
    setSelectedCiudad('');
    setSelectedDiasCierre([]);
    setSearchText('');
  };

  // Animated Favorite Button Component
  const AnimatedFavoriteButton = ({ vacante, isFavorite, onPress }) => {
    const scaleAnim = new Animated.Value(1);

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    };

    return (
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={animatePress}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Heart 
            size={18} 
            color={isFavorite ? '#f59e0b' : '#d1d5db'} 
            fill={isFavorite ? '#f59e0b' : 'none'}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Render vacancy card
  const renderVacancyCard = useCallback(({ item: vacante }) => {
    const daysRemaining = getDaysRemaining(vacante.fecha_expiracion);
    const daysPublished = getDaysPublished(vacante.fecha_publicacion);
    const isUrgent = daysRemaining && (daysRemaining.includes('hoy') || daysRemaining.includes('mañana'));
    const isFavorite = favorites.has(vacante.id);
    const salary = formatSalary(vacante);
    const cleanDescription = cleanHtml(vacante.descripcion);
    const formattedModality = formatModality(vacante.modalidad);

    return (
      <TouchableOpacity 
        style={[styles.card, isUrgent && styles.urgentCard]} 
        onPress={() => handleVacancyPress(vacante)}
        activeOpacity={0.95}
      >
        {/* Favorite button */}
        <AnimatedFavoriteButton 
          vacante={vacante}
          isFavorite={isFavorite}
          onPress={() => toggleFavorite(vacante)}
        />

        {/* Company logo */}
        <View style={styles.companyLogoContainer}>
          <View style={styles.companyLogo}>
            {vacante.logo ? (
              <Image 
                source={{ uri: `` }}
                style={styles.companyLogoImage}
                resizeMode="contain"
                onError={() => {
                  // Si la imagen falla al cargar, mostrar las iniciales
                  console.log('Error loading logo for:', vacante.nombre_empresa);
                }}
              />
            ) : (
              <Text style={styles.companyLogoPlaceholder}>
                {getCompanyInitials(vacante.nombre_empresa)}
              </Text>
            )}
          </View>
        </View>

        {/* Company name */}
        <Text style={styles.companyName} numberOfLines={1}>
          {vacante.nombre_empresa || 'Empresa'}
        </Text>

        {/* Vacancy title */}
        <Text style={styles.vacancyTitle} numberOfLines={2}>
          {vacante.titulo}
        </Text>

        {/* Description */}
        <Text style={styles.vacancyDescription} numberOfLines={3}>
          {cleanDescription || 'Descripción no disponible. Esta vacante ofrece una excelente oportunidad de crecimiento y aprendizaje.'}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {/* Vacancy type */}
          <View style={[styles.tag, styles.tagVacancyType]}>
            <Text style={[styles.tagText, { color: '#e6007e' }]}>
              {vacante.tipo || 'Servicio Social'}
            </Text>
          </View>

          {/* Category */}
          {vacante.categoria && (
            <View style={[styles.tag, styles.tagCategory]}>
              <Text style={[styles.tagText, { color: '#3b82f6' }]}>
                {vacante.categoria}
              </Text>
            </View>
          )}

          {/* Modality */}
          <View style={[styles.tag, styles.tagModality]}>
            <Text style={[styles.tagText, { color: '#059669' }]}>
              {formattedModality}
            </Text>
          </View>

          {/* Location */}
          <View style={[styles.tag, styles.tagLocation]}>
            <Text style={[styles.tagText, { color: '#0284c7' }]}>
              {vacante.ciudad || 'No especificada'}
            </Text>
          </View>

          {/* Days remaining */}
          {daysRemaining && (
            <View style={[styles.tag, styles.tagClosing, isUrgent && styles.tagUrgent]}>
              <Text style={[styles.tagText, { color: isUrgent ? "#dc2626" : "#dc2626" }]}>
                {daysRemaining}
              </Text>
            </View>
          )}

          {/* Salary */}
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
            Publicado hace {daysPublished} día{daysPublished !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Urgent indicator */}
        {isUrgent && (
          <View style={styles.urgentIndicator}>
            <Text style={styles.urgentIndicatorText}>¡URGENTE!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [favorites]);

  // Render filter option
  const renderFilterOption = ({ title, options, selected, onToggle, multiSelect = true }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.filterOption}
          onPress={() => onToggle(option)}
        >
          <View style={[
            styles.checkbox,
            (multiSelect ? selected.includes(option) : selected === option) && styles.checkboxSelected
          ]}>
            {(multiSelect ? selected.includes(option) : selected === option) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.filterOptionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Toggle filter functions
  const toggleTipoVacante = (tipo) => {
    setSelectedTipoVacante(prev => 
      prev.includes(tipo) 
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  };

  const toggleModalidad = (modalidad) => {
    setSelectedModalidad(prev => 
      prev.includes(modalidad) 
        ? prev.filter(m => m !== modalidad)
        : [...prev, modalidad]
    );
  };

  const toggleDiasCierre = (dias) => {
    setSelectedDiasCierre(prev => 
      prev.includes(dias) 
        ? prev.filter(d => d !== dias)
        : [...prev, dias]
    );
  };

  // Memoizar el componente de filtros para evitar re-renders innecesarios
  const FilterComponent = useMemo(() => {
    if (!showFilters) return null;

    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filtros</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearFiltersText}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterScrollView} showsVerticalScrollIndicator={false}>
          {renderFilterOption({
            title: "Tipo de vacante",
            options: tiposVacante,
            selected: selectedTipoVacante,
            onToggle: toggleTipoVacante
          })}

          {renderFilterOption({
            title: "Modalidad",
            options: modalidades,
            selected: selectedModalidad,
            onToggle: toggleModalidad
          })}

          {renderFilterOption({
            title: "Categoría",
            options: categorias,
            selected: selectedCategoria,
            onToggle: setSelectedCategoria,
            multiSelect: false
          })}

          {renderFilterOption({
            title: "Ciudad",
            options: getCiudades(),
            selected: selectedCiudad,
            onToggle: setSelectedCiudad,
            multiSelect: false
          })}

          {renderFilterOption({
            title: "Días de cierre",
            options: ['7', '15', '30'],
            selected: selectedDiasCierre,
            onToggle: toggleDiasCierre
          })}
        </ScrollView>
      </View>
    );
  }, [showFilters, selectedTipoVacante, selectedModalidad, selectedCategoria, selectedCiudad, selectedDiasCierre, vacantes]);

  // Render header (solo la parte estática)
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSubtitle}>
          {filteredVacantes.length} vacante{filteredVacantes.length !== 1 ? 's' : ''} disponible{filteredVacantes.length !== 1 ? 's' : ''}
        </Text>
      </View>
      {FilterComponent}
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Briefcase size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>No hay vacantes disponibles</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchText ? 'Intenta con otros términos de búsqueda' : 'Vuelve a intentar más tarde'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>Cargando vacantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />
      
      {/* Search bar fijo en la parte superior */}
      <View style={styles.fixedHeader}>
        <View style={{ height: 20 }} />
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#0066ff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar vacantes por título, empresa, ubicación..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          
          {/* Filter button */}
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#ffffff" : "#0066ff"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de vacantes */}
      <FlatList
        data={filteredVacantes}
        renderItem={renderVacancyCard}
        keyExtractor={(item) => item.id.toString()}
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
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
  listHeader: {
    backgroundColor: '#f5f7ff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  searchInputContainer: {
    flex: 1,
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
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 12,
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
  filterButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 12,
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
    maxHeight: 400,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#0066ff',
    fontWeight: '500',
  },
  filterScrollView: {
    maxHeight: 320,
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#4b5563',
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
    color: '#ffffff',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
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
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaInfo: {
    marginBottom: 16,
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