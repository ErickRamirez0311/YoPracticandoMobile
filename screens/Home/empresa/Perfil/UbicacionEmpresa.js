import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { 
  MapPin, 
  Save, 
  Navigation,
  CheckCircle,
  ExternalLink
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = '';

export default function UbicacionEmpresa() {
  const [direccion, setDireccion] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const ubicacionesList = [
    'Hermosillo',
    'Cajeme (Ciudad Obregón)',
    'Nogales',
    'San Luis Río Colorado',
    'Navojoa',
    'Guaymas',
    'Agua Prieta',
    'Puerto Peñasco',
    'Caborca',
    'Cananea',
    'Magdalena de Kino',
    'Huatabampo',
    'Etchojoa',
    'Álamos',
    'Otro',
  ];

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        await cargarUbicacion(id);
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

  const cargarUbicacion = async (usuario_id) => {
    try {
      const response = await fetch(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          usuario_id: usuario_id,
          accion: 'obtenerDatos'
        }).toString()
      });

      const data = await response.json();
      
      if (data.success && data.empresa) {
        const empresa = data.empresa;
        setDireccion(empresa.direccion || '');
        setUbicacion(empresa.ubicacion || '');
      }
    } catch (error) {
      console.error('Error al cargar ubicación:', error);
    }
  };

  const generarMapaURL = () => {
    if (!direccion && !ubicacion) return null;
    
    const query = direccion ? `${direccion}, ${ubicacion}` : ubicacion;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const abrirEnMapa = async () => {
    const url = generarMapaURL();
    if (!url) {
      Alert.alert('Error', 'Necesitas agregar al menos la ciudad o dirección');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir Google Maps');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al abrir el mapa');
    }
  };

  const handleGuardar = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    setSaving(true);

    try {
      const datosActualizar = {
        usuario_id: userId,
        accion: 'actualizarDatos',
        direccion: direccion.trim(),
        ubicacion,
      };

      const response = await fetch(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizar),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', data.message || 'Ubicación actualizada correctamente');
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar ubicación');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando ubicación...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Proporciona la ubicación de tu empresa para que los candidatos puedan encontrarte fácilmente
        </Text>

        {/* Ubicación Principal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MapPin size={24} color="#dc2626" />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Ubicación Principal</Text>
              <Text style={styles.sectionSubtitle}>Ciudad y dirección de tu empresa</Text>
            </View>
            {(direccion || ubicacion) && (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={abrirEnMapa}
              >
                <Navigation size={16} color="#2563eb" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ubicacion}
                onValueChange={setUbicacion}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una ciudad" value="" />
                {ubicacionesList.map((ub, index) => (
                  <Picker.Item label={ub} value={ub} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección completa</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Calle, número, colonia..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.hint}>
              Ejemplo: Av. Universidad 123, Col. Centro
            </Text>
          </View>
        </View>



        {/* Vista Previa de Ubicación */}
        {(direccion || ubicacion) && (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <MapPin size={20} color="#16a34a" />
              <Text style={styles.previewTitle}>Vista previa de ubicación</Text>
            </View>
            
            <View style={styles.previewCard}>
              <View style={styles.previewContent}>
                <Text style={styles.previewAddress}>
                  {direccion || 'Dirección no especificada'}
                </Text>
                <Text style={styles.previewCity}>
                  {ubicacion}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.previewMapButton}
                onPress={abrirEnMapa}
              >
                <ExternalLink size={16} color="#2563eb" />
                <Text style={styles.previewMapButtonText}>Ver en mapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}



        {/* Resumen */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Estado de la ubicación</Text>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={ubicacion ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: ubicacion ? '#10b981' : '#9ca3af' }]}>
              Ciudad {ubicacion ? '✓' : '(requerida)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={direccion ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: direccion ? '#10b981' : '#9ca3af' }]}>
              Dirección {direccion ? '✓' : '(opcional)'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleGuardar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Save size={18} color="#ffffff" />
              <Text style={styles.saveButtonText}>Guardar Ubicación</Text>
            </>
          )}
        </TouchableOpacity>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  mapButton: {
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  previewSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewContent: {
    marginBottom: 16,
  },
  previewAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  previewCity: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  previewReferences: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  previewHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewHorarioText: {
    fontSize: 14,
    color: '#6b7280',
  },
  previewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  previewMapButtonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  tipsList: {
    paddingLeft: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});