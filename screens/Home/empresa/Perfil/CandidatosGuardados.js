import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { 
  Heart,
  Users,
  Search,
  Filter,
  Star,
  Calendar,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Trash2,
  MessageCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CandidatosGuardados() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [userId, setUserId] = useState(null);

  // Mock data para demostración
  const candidatosMock = [
    {
      id: 1,
      nombre: 'Ana García Rodríguez',
      puesto: 'Desarrolladora Frontend',
      universidad: 'ITSON',
      carrera: 'Ingeniería en Software',
      ubicacion: 'Hermosillo',
      email: 'ana.garcia@email.com',
      telefono: '+52 662 123 4567',
      foto: null,
      habilidades: ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js'],
      fechaGuardado: '2025-06-10',
      calificacion: 4.8,
      experiencia: '2 años',
      estado: 'disponible',
      descripcion: 'Desarrolladora apasionada por crear interfaces de usuario intuitivas y modernas.',
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez López',
      puesto: 'Diseñador UX/UI',
      universidad: 'UNISON',
      carrera: 'Diseño Gráfico',
      ubicacion: 'Hermosillo',
      email: 'carlos.rodriguez@email.com',
      telefono: '+52 662 234 5678',
      foto: null,
      habilidades: ['Figma', 'Adobe XD', 'Creatividad', 'Prototipado', 'Investigación UX'],
      fechaGuardado: '2025-06-08',
      calificacion: 4.9,
      experiencia: '3 años',
      estado: 'en_proceso',
      descripcion: 'Especialista en experiencia de usuario con enfoque en diseño centrado en el usuario.',
    },
    {
      id: 3,
      nombre: 'María López Sánchez',
      puesto: 'Analista de Datos',
      universidad: 'ITSON',
      carrera: 'Ingeniería Industrial',
      ubicacion: 'Hermosillo',
      email: 'maria.lopez@email.com',
      telefono: '+52 662 345 6789',
      foto: null,
      habilidades: ['Python', 'SQL', 'Power BI', 'Excel', 'Machine Learning'],
      fechaGuardado: '2025-06-05',
      calificacion: 4.7,
      experiencia: '1.5 años',
      estado: 'disponible',
      descripcion: 'Analista con experiencia en visualización de datos y business intelligence.',
    },
    {
      id: 4,
      nombre: 'Diego Morales Castro',
      puesto: 'Desarrollador Backend',
      universidad: 'UNISON',
      carrera: 'Ciencias de la Computación',
      ubicacion: 'Hermosillo',
      email: 'diego.morales@email.com',
      telefono: '+52 662 456 7890',
      foto: null,
      habilidades: ['Java', 'Spring Boot', 'MySQL', 'AWS', 'Docker'],
      fechaGuardado: '2025-06-02',
      calificacion: 4.6,
      experiencia: '2.5 años',
      estado: 'contactado',
      descripcion: 'Desarrollador backend especializado en microservicios y arquitecturas escalables.',
    },
    {
      id: 5,
      nombre: 'Sofia Herrera Ruiz',
      puesto: 'Marketing Digital',
      universidad: 'ITSON',
      carrera: 'Mercadotecnia',
      ubicacion: 'Hermosillo',
      email: 'sofia.herrera@email.com',
      telefono: '+52 662 567 8901',
      foto: null,
      habilidades: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics', 'Content Marketing'],
      fechaGuardado: '2025-05-30',
      calificacion: 4.5,
      experiencia: '1 año',
      estado: 'disponible',
      descripcion: 'Especialista en marketing digital con enfoque en campañas publicitarias efectivas.',
    },
  ];

  const filtros = [
    { id: 'todos', label: 'Todos', count: candidatosMock.length },
    { id: 'disponible', label: 'Disponibles', count: candidatosMock.filter(c => c.estado === 'disponible').length },
    { id: 'contactado', label: 'Contactados', count: candidatosMock.filter(c => c.estado === 'contactado').length },
    { id: 'en_proceso', label: 'En proceso', count: candidatosMock.filter(c => c.estado === 'en_proceso').length },
  ];

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        await cargarCandidatos(id);
      } else {
        Alert.alert('Error', 'No se encontró el ID del usuario');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const cargarCandidatos = async (usuario_id) => {
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCandidatos(candidatosMock);
    } catch (error) {
      console.error('Error al cargar candidatos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarCandidatos(userId);
    setRefreshing(false);
  };

  const filtrarCandidatos = () => {
    if (filtroActivo === 'todos') {
      return candidatos;
    }
    return candidatos.filter(candidato => candidato.estado === filtroActivo);
  };

  const eliminarCandidato = (candidatoId) => {
    Alert.alert(
      'Eliminar candidato',
      '¿Estás seguro de que quieres eliminar este candidato de tus guardados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setCandidatos(candidatos.filter(c => c.id !== candidatoId));
          },
        },
      ]
    );
  };

  const contactarCandidato = (candidato) => {
    Alert.alert(
      'Contactar candidato',
      `¿Cómo quieres contactar a ${candidato.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Email', onPress: () => Alert.alert('Función no disponible', 'Esta función estará disponible próximamente') },
        { text: 'WhatsApp', onPress: () => Alert.alert('Función no disponible', 'Esta función estará disponible próximamente') },
        { text: 'Mensaje interno', onPress: () => Alert.alert('Función no disponible', 'Esta función estará disponible próximamente') },
      ]
    );
  };

  const cambiarEstadoCandidato = (candidatoId, nuevoEstado) => {
    setCandidatos(candidatos.map(candidato => 
      candidato.id === candidatoId 
        ? { ...candidato, estado: nuevoEstado }
        : candidato
    ));
  };

  const getUserInitials = (nombre) => {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#10b981';
      case 'contactado': return '#3b82f6';
      case 'en_proceso': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'contactado': return 'Contactado';
      case 'en_proceso': return 'En proceso';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando candidatos...</Text>
      </SafeAreaView>
    );
  }

  const candidatosFiltrados = filtrarCandidatos();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.subtitle}>
          Gestiona los perfiles que has guardado y mantén contacto con candidatos de interés
        </Text>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <Heart size={24} color="#ef4444" />
            </View>
            <Text style={styles.statsNumber}>{candidatos.length}</Text>
            <Text style={styles.statsLabel}>Candidatos guardados</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#dbeafe' }]}>
              <Users size={24} color="#2563eb" />
            </View>
            <Text style={styles.statsNumber}>
              {candidatos.filter(c => c.estado === 'contactado' || c.estado === 'en_proceso').length}
            </Text>
            <Text style={styles.statsLabel}>En seguimiento</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filtros.map((filtro) => (
              <TouchableOpacity
                key={filtro.id}
                style={[
                  styles.filterButton,
                  filtroActivo === filtro.id && styles.filterButtonActive
                ]}
                onPress={() => setFiltroActivo(filtro.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filtroActivo === filtro.id && styles.filterButtonTextActive
                  ]}
                >
                  {filtro.label} ({filtro.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de candidatos */}
        {candidatosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No hay candidatos guardados</Text>
            <Text style={styles.emptyDescription}>
              {filtroActivo === 'todos' 
                ? 'Aún no has guardado ningún candidato. Explora perfiles y guarda los que más te interesen.'
                : `No hay candidatos con el estado "${filtros.find(f => f.id === filtroActivo)?.label}".`
              }
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Search size={20} color="#2563eb" />
              <Text style={styles.exploreButtonText}>Explorar candidatos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          candidatosFiltrados.map((candidato) => (
            <View key={candidato.id} style={styles.candidatoCard}>
              {/* Header del candidato */}
              <View style={styles.candidatoHeader}>
                <View style={styles.candidatoAvatar}>
                  <Text style={styles.candidatoAvatarText}>
                    {getUserInitials(candidato.nombre)}
                  </Text>
                </View>
                
                <View style={styles.candidatoMainInfo}>
                  <Text style={styles.candidatoNombre}>{candidato.nombre}</Text>
                  <Text style={styles.candidatoPuesto}>{candidato.puesto}</Text>
                  
                  <View style={styles.candidatoMeta}>
                    <View style={styles.metaItem}>
                      <GraduationCap size={12} color="#6b7280" />
                      <Text style={styles.metaText}>{candidato.universidad}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MapPin size={12} color="#6b7280" />
                      <Text style={styles.metaText}>{candidato.ubicacion}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.candidatoActions}>
                  <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(candidato.estado) + '20' }]}>
                    <Text style={[styles.estadoText, { color: getEstadoColor(candidato.estado) }]}>
                      {getEstadoLabel(candidato.estado)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarCandidato(candidato.id)}
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Información adicional */}
              <View style={styles.candidatoDetails}>
                <Text style={styles.candidatoDescripcion}>{candidato.descripcion}</Text>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Star size={16} color="#f59e0b" />
                    <Text style={styles.infoText}>{candidato.calificacion}/5.0</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Calendar size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{candidato.experiencia}</Text>
                  </View>
                </View>

                {/* Habilidades */}
                <View style={styles.habilidadesContainer}>
                  {candidato.habilidades.slice(0, 3).map((habilidad, index) => (
                    <View key={index} style={styles.habilidadTag}>
                      <Text style={styles.habilidadText}>{habilidad}</Text>
                    </View>
                  ))}
                  {candidato.habilidades.length > 3 && (
                    <View style={styles.habilidadTag}>
                      <Text style={styles.habilidadText}>
                        +{candidato.habilidades.length - 3} más
                      </Text>
                    </View>
                  )}
                </View>

                {/* Información de contacto y fecha */}
                <View style={styles.candidatoFooter}>
                  <Text style={styles.fechaGuardado}>
                    Guardado el {new Date(candidato.fechaGuardado).toLocaleDateString('es-ES')}
                  </Text>
                  
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => contactarCandidato(candidato)}
                    >
                      <MessageCircle size={16} color="#2563eb" />
                      <Text style={styles.contactButtonText}>Contactar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.viewButton}>
                      <ExternalLink size={16} color="#6b7280" />
                      <Text style={styles.viewButtonText}>Ver perfil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Botón para explorar más candidatos */}
        {candidatosFiltrados.length > 0 && (
          <TouchableOpacity style={styles.exploreMoreButton}>
            <Search size={20} color="#2563eb" />
            <Text style={styles.exploreMoreButtonText}>Explorar más candidatos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fee2e2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  candidatoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  candidatoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  candidatoAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  candidatoAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  candidatoMainInfo: {
    flex: 1,
  },
  candidatoNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  candidatoPuesto: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  candidatoMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  candidatoActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  candidatoDetails: {},
  candidatoDescripcion: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  habilidadesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  habilidadTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habilidadText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  candidatoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fechaGuardado: {
    fontSize: 12,
    color: '#9ca3af',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  contactButtonText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  viewButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  exploreButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  exploreMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  exploreMoreButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
});