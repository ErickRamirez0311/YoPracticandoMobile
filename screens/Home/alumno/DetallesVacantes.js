// screens/HomeScreen/alumno/DetallesVacantes.js
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
  Share,
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Tag,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetallesVacantes({ route, navigation }) {
  const { vacanteId } = route.params;
  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [applying, setApplying] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userType: null
  });

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  // Verificar si es favorito cuando se cargan los datos del usuario
  useEffect(() => {
    if (userInfo.userId && vacante) {
      verificarFavorito();
    }
  }, [userInfo.userId, vacante]);

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

  // Verificar si la vacante está en favoritos
  const verificarFavorito = async () => {
    if (!userInfo.userId || !vacante) return;
    
    try {
      const response = await fetch(``);
      const data = await response.json();
      
      if (data.success) {
        const esFavorito = data.favoritos.some(fav => fav.vacante_id === vacante.id);
        setIsFavorite(esFavorito);
      }
    } catch (error) {
      console.error('Error al verificar favorito:', error);
    }
  };

  // Toggle favorite with API integration
  const toggleFavorite = async () => {
    if (!userInfo.userId) {
      Alert.alert('Error', 'Necesitas iniciar sesión para agregar favoritos');
      return;
    }

    if (!vacante) return;

    setFavoriteLoading(true);
    
    try {
      if (isFavorite) {
        // Quitar de favoritos
        const response = await fetch(``, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(false);
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
          setIsFavorite(true);
        } else {
          Alert.alert('Error', data.message || 'Error al agregar a favoritos');
        }
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      Alert.alert('Error', 'No se pudo actualizar el favorito. Intenta de nuevo.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Fetch vacancy details
  const fetchVacanteDetails = async () => {
    try {
      const response = await fetch(``);
      const data = await response.json();
      
      if (response.ok && data) {
        setVacante(data);
      } else {
        Alert.alert('Error', data.error || 'Error al cargar los detalles de la vacante');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching vacancy details:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacanteDetails();
  }, [vacanteId]);

  // Clean HTML from text - simplificado
  const cleanHtml = (text) => {
    if (!text) return '';
    
    return text
      // Convertir entidades HTML
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  // Renderizar HTML con estilos para títulos
  const renderHtmlContent = (htmlContent) => {
    if (!htmlContent) return null;

    // Dividir el contenido por elementos de bloque, incluyendo enlaces
    const parts = htmlContent.split(/(<\/?(?:h[1-6]|p|div|br|ul|ol|li|strong|b|em|i|u|a)[^>]*>)/gi);
    const elements = [];
    let currentStyle = styles.description;
    let key = 0;
    let listItems = [];
    let isProcessingList = false;
    let isOrderedList = false;
    let currentLink = null;
    let currentListItemContent = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (!part) continue;

      // Detectar elementos HTML
      if (part.startsWith('<')) {
        if (part.match(/<h1[^>]*>/i)) {
          currentStyle = styles.descriptionH1;
        } else if (part.match(/<h2[^>]*>/i)) {
          currentStyle = styles.descriptionH2;
        } else if (part.match(/<h3[^>]*>/i)) {
          currentStyle = styles.descriptionH3;
        } else if (part.match(/<h4[^>]*>/i)) {
          currentStyle = styles.descriptionH4;
        } else if (part.match(/<h5[^>]*>/i)) {
          currentStyle = styles.descriptionH5;
        } else if (part.match(/<h6[^>]*>/i)) {
          currentStyle = styles.descriptionH6;
        } else if (part.match(/<\/h[1-6][^>]*>/i)) {
          currentStyle = styles.description;
          // Solo un salto de línea después de los títulos
          elements.push(
            <Text key={key++} style={styles.description}>{'\n'}</Text>
          );
        } else if (part.match(/<br[^>]*>/i)) {
          if (isProcessingList && currentListItemContent.length > 0) {
            // Agregar salto de línea dentro del item de lista
            currentListItemContent.push(<Text key={currentListItemContent.length}>{'\n'}</Text>);
          } else {
            elements.push(
              <Text key={key++} style={styles.description}>{'\n'}</Text>
            );
          }
        } else if (part.match(/<ul[^>]*>/i)) {
          isProcessingList = true;
          isOrderedList = false;
          listItems = [];
        } else if (part.match(/<ol[^>]*>/i)) {
          isProcessingList = true;
          isOrderedList = true;
          listItems = [];
        } else if (part.match(/<\/ul>|<\/ol>/i)) {
          if (listItems.length > 0) {
            elements.push(
              <View key={key++} style={styles.listContainer}>
                {listItems.map((item, index) => (
                  <View key={index} style={styles.listItemContainer}>
                    <Text style={styles.listBullet}>
                      {isOrderedList ? `${index + 1}.` : '•'}
                    </Text>
                    <View style={styles.listItemTextContainer}>
                      {item}
                    </View>
                  </View>
                ))}
              </View>
            );
          }
          isProcessingList = false;
          isOrderedList = false;
          listItems = [];
          elements.push(
            <Text key={key++} style={styles.description}>{'\n'}</Text>
          );
        } else if (part.match(/<li[^>]*>/i)) {
          // Comenzar nuevo item de lista
          currentListItemContent = [];
        } else if (part.match(/<\/li>/i)) {
          // Terminar item de lista y agregarlo
          if (currentListItemContent.length > 0) {
            listItems.push(currentListItemContent);
          }
          currentListItemContent = [];
        } else if (part.match(/<\/p>|<\/div>/i)) {
          if (isProcessingList && currentListItemContent.length > 0) {
            // Agregar salto de línea dentro del item de lista
            currentListItemContent.push(<Text key={currentListItemContent.length}>{'\n'}</Text>);
          } else {
            elements.push(
              <Text key={key++} style={styles.description}>{'\n'}</Text>
            );
          }
        } else if (part.match(/<a[^>]*>/i)) {
          // Extraer la URL del enlace
          const hrefMatch = part.match(/href\s*=\s*["']([^"']+)["']/i);
          if (hrefMatch) {
            currentLink = hrefMatch[1];
          }
          continue;
        } else if (part.match(/<\/a>/i)) {
          currentLink = null;
          continue;
        }
        continue;
      }

      // Limpiar texto y agregarlo si no está vacío
      const cleanText = part
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      if (cleanText) {
        if (isProcessingList) {
          // Si estamos procesando una lista, agregar al contenido del item actual
          if (currentLink) {
            // Enlace dentro de lista
            currentListItemContent.push(
              <Text 
                key={currentListItemContent.length}
                style={[styles.listItemText, styles.linkText]}
                onPress={() => openLink(currentLink)}
              >
                {cleanText}
              </Text>
            );
          } else {
            currentListItemContent.push(
              <Text key={currentListItemContent.length} style={styles.listItemText}>
                {cleanText}
              </Text>
            );
          }
        } else {
          if (currentLink) {
            // Enlace fuera de lista
            elements.push(
              <Text 
                key={key++}
                style={[currentStyle, styles.linkText]}
                onPress={() => openLink(currentLink)}
              >
                {cleanText}
              </Text>
            );
          } else {
            elements.push(
              <Text key={key++} style={currentStyle}>
                {cleanText}
              </Text>
            );
          }
        }
      }
    }

    return elements;
  };

  // Función para abrir enlaces
  const openLink = async (url) => {
    try {
      // Verificar si la URL es válida
      let validUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = 'https://' + url;
      }
      
      const supported = await Linking.canOpenURL(validUrl);
      if (supported) {
        await Linking.openURL(validUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  // Get career names in Spanish
  const getCareerName = (carrera) => {
    const careerMap = {
      'sistemas': 'Ing. en Sistemas Computacionales',
      'industrial': 'Ing. Industrial', 
      'administracion': 'Administración de Empresas',
      'contaduria': 'Contaduría Pública',
      'mecanica': 'Ing. Mecánica',
      'electronica': 'Ing. Electrónica',
      'quimica': 'Ing. Química',
      'gestion': 'Gestión Empresarial'
    };
    return careerMap[carrera] || carrera;
  };

  // Get modality names in Spanish
  const getModalityName = (modalidad) => {
    const modalityMap = {
      'medio_tiempo': 'Medio tiempo',
      'tiempo_completo': 'Tiempo completo', 
      'remoto': 'Remoto',
      'hibrido': 'Híbrido'
    };
    return modalityMap[modalidad] || modalidad;
  };

  // Render modality tags
  const renderModalityTags = (modalidadString) => {
    if (!modalidadString) return <Text style={styles.infoValue}>No especificado</Text>;
    
    const modalidades = modalidadString.split(',').map(m => m.trim());
    return (
      <View style={styles.tagsContainer}>
        {modalidades.map((modalidad, index) => (
          <View key={index} style={styles.modalityTag}>
            <Text style={styles.modalityTagText}>{getModalityName(modalidad)}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render career tags
  const renderCareerTags = (carrerasString) => {
    if (!carrerasString) return <Text style={styles.infoValue}>No especificado</Text>;
    
    const carreras = carrerasString.split(',').map(c => c.trim());
    return (
      <View style={styles.tagsContainer}>
        {carreras.map((carrera, index) => (
          <View key={index} style={styles.careerTag}>
            <Text style={styles.careerTagText}>{getCareerName(carrera)}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Format modality
  const formatModality = (modalidad) => {
    if (!modalidad) return 'Tiempo Completo';
    return modalidad
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
      
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${vacante.moneda || 'MXN'}/${vacante.tipo_tarifa || 'Mes'}`;
    } else if (vacante.salario_fijo) {
      const salario = parseFloat(vacante.salario_fijo);
      
      if (salario === 0) {
        return 'Sin remuneración';
      }
      
      return `$${salario.toLocaleString()} ${vacante.moneda || 'MXN'}/${vacante.tipo_tarifa || 'Mes'}`;
    }
    
    return 'Sin remuneración';
  };

  // Format date in Spanish
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = meses[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month}, ${year}`;
  };

  // Get days remaining
  const getDaysRemaining = (fechaExpiracion) => {
    if (!fechaExpiracion) return null;
    
    const today = new Date();
    const expirationDate = new Date(fechaExpiracion);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expirada', isExpired: true };
    if (diffDays === 0) return { text: 'Expira hoy', isExpired: false };
    if (diffDays === 1) return { text: 'Expira mañana', isExpired: false };
    return { text: `Cierra en ${diffDays} días`, isExpired: false };
  };

  // Share vacancy
  const shareVacancy = async () => {
    try {
      const result = await Share.share({
        message: `¡Mira esta oportunidad de ${vacante.tipo}!\n\n${vacante.titulo}\n\nUbicación: ${vacante.ciudad}\nModalidad: ${formatModality(vacante.modalidad)}\n\n¡Aplica ahora en YoPracticando!`,
        url: ``,
        title: vacante.titulo,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Apply to vacancy
  const applyToVacancy = () => {
    Alert.alert(
      'Aplicar a vacante',
      `¿Estás seguro que quieres aplicar a "${vacante.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aplicar', 
          onPress: () => {
            setApplying(true);
            // Simular aplicación
            setTimeout(() => {
              setApplying(false);
              Alert.alert('¡Éxito!', 'Tu aplicación ha sido enviada correctamente.');
            }, 2000);
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!vacante) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>Vacante no encontrada</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining(vacante.fecha_expiracion);
  const salary = formatSalary(vacante);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={shareVacancy}
          >
            <Share2 size={22} color="#000000" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={toggleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <ActivityIndicator size={20} color="#007AFF" />
            ) : (
              <Heart 
                size={22} 
                color={isFavorite ? '#007AFF' : '#000000'} 
                fill={isFavorite ? '#007AFF' : 'none'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vacancy Title */}
        <View style={styles.titleSection}>
          <Text style={styles.vacancyTitle}>{vacante.titulo}</Text>
        </View>

        {/* Information List */}
        <View style={styles.infoSection}>
          
          {/* Tipo */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Tag size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{vacante.tipo || 'No especificado'}</Text>
            </View>
          </View>

          {/* Ciudad */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <MapPin size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ciudad</Text>
              <Text style={styles.infoValue}>{vacante.ciudad || 'No especificada'}</Text>
            </View>
          </View>

          {/* Categoría */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Building2 size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <Text style={styles.infoValue}>{vacante.categoria || 'No especificada'}</Text>
            </View>
          </View>

          {/* Modalidad */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Briefcase size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Modalidad</Text>
              <Text style={styles.infoValue}>{formatModality(vacante.modalidad)}</Text>
            </View>
          </View>

          {/* Carrera */}
          {vacante.carrera && (
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <GraduationCap size={16} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Carreras</Text>
                {renderCareerTags(vacante.carrera)}
              </View>
            </View>
          )}

          {/* Salario */}
          {salary && (
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <DollarSign size={16} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Salario</Text>
                <Text style={styles.infoValue}>{salary}</Text>
              </View>
            </View>
          )}

          {/* Cantidad a reclutar */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Users size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Cantidad a reclutar</Text>
              <Text style={styles.infoValue}>
                {vacante.cantidad === 'mas' ? 'Más de 5 personas' : 
                 vacante.cantidad ? `${vacante.cantidad} ${vacante.cantidad == 1 ? 'persona' : 'personas'}` : 
                 'No especificado'}
              </Text>
            </View>
          </View>

          {/* Fecha de publicación */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Calendar size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha de publicación</Text>
              <Text style={styles.infoValue}>
                {formatDate(vacante.fecha_publicacion)}
              </Text>
            </View>
          </View>

          {/* Fecha de expiración */}
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Clock size={16} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha límite</Text>
              <Text style={styles.infoValue}>
                {formatDate(vacante.fecha_expiracion)}
              </Text>
            </View>
          </View>

          {/* Estado de la vacante (días restantes) */}
          {daysRemaining && (
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <AlertCircle size={16} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Estado</Text>
                <Text style={[styles.infoValue, daysRemaining.isExpired && styles.expiredText]}>
                  {daysRemaining.text}
                </Text>
              </View>
            </View>
          )}

        </View>

        {/* Description Section */}
        {vacante.descripcion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <View style={styles.descriptionContainer}>
              {renderHtmlContent(vacante.descripcion)}
            </View>
          </View>
        )}

        {/* Bottom spacing for apply button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Apply Button */}
      {!daysRemaining?.isExpired && (
        <View style={styles.applyContainer}>
          <TouchableOpacity 
            style={[styles.applyButton, applying && styles.applyButtonDisabled]}
            onPress={applyToVacancy}
            disabled={applying}
          >
            {applying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.applyButtonText}>Aplicar ahora</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  vacancyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  expiredText: {
    color: '#dc2626',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  careerTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  careerTagText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalityTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  modalityTagText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  descriptionContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  descriptionH1: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 28,
    marginTop: 4,
    marginBottom: 2,
  },
  descriptionH2: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 26,
    marginTop: 4,
    marginBottom: 2,
  },
  descriptionH3: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 24,
    marginTop: 2,
    marginBottom: 2,
  },
  descriptionH4: {
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 22,
    marginTop: 2,
    marginBottom: 2,
  },
  descriptionH5: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  descriptionH6: {
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 2,
  },
  listContainer: {
    marginVertical: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  listBullet: {
    fontSize: 16,
    color: '#333333',
    marginRight: 8,
    lineHeight: 24,
    minWidth: 16,
  },
  listItemText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    flex: 1,
  },
  listItemTextContainer: {
    flex: 1,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});