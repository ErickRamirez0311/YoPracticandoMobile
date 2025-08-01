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
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Building, Camera, Save, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_BASE = '';

export default function InformacionEmpresa() {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [categorias, setCategorias] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [anioFundacion, setAnioFundacion] = useState('');
  const [tamanioEmpresa, setTamanioEmpresa] = useState('');
  const [logo, setLogo] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const categoriasList = [
    'Tecnología y Desarrollo de Software',
    'Ventas y Comercio',
    'Atención a Clientes y Call Centers',
    'Administración y Oficina',
    'Contabilidad y Finanzas',
    'Marketing y Publicidad',
    'Educación y Capacitación',
    'Salud y Medicina',
    'Logística y Transporte',
    'Manufactura y Producción',
    'Construcción e Ingeniería Civil',
    'Recursos Humanos y Reclutamiento',
    'Legal y Jurídico',
    'Turismo y Hospitalidad',
    'Diseño y Creatividad',
    'Servicios Generales y Mantenimiento',
    'Ciencias y Laboratorio',
    'Bienes Raíces y Construcción',
    'Energía y Medio Ambiente',
    'Agroindustria y Campo',
  ];

  const tamañosList = [
    { label: 'Micro (1-10 Empleados)', value: 'Micro' },
    { label: 'Pequeña (11-50 Empleados)', value: 'Pequeña' },
    { label: 'Mediana (51-250 Empleados)', value: 'Mediana' },
    { label: 'Grande (251+ Empleados)', value: 'Grande' },
  ];

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        await cargarDatosEmpresa(id);
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

  const cargarDatosEmpresa = async (usuario_id) => {
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
        setNombreEmpresa(empresa.nombre_empresa || '');
        setCategorias(empresa.categorias || '');
        setDescripcion(empresa.descripcion || '');
        setEmail(empresa.email || '');
        setTelefono(empresa.telefono || '');
        setAnioFundacion(empresa.anio_fundacion || '');
        setTamanioEmpresa(empresa.tamanio_empresa || '');
        setLogo(empresa.logo ? `` : '');
      }
    } catch (error) {
      console.error('Error al cargar datos de empresa:', error);
    }
  };

  const handleCambiarLogo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar el logo');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const formData = new FormData();
        formData.append('usuario_id', userId);
        formData.append('accion', 'subirLogo');
        
        let fileExtension = image.uri.split('.').pop();
        let fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        formData.append('logo', {
          uri: image.uri,
          type: fileType,
          name: `logo_${Date.now()}.${fileExtension}`,
        });

        const response = await fetch(`${API_BASE}/empresa.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          Alert.alert('Éxito', 'Logo actualizado correctamente');
          setLogo(``);
        } else {
          Alert.alert('Error', data.message || 'Error al subir el logo');
        }
      }
    } catch (error) {
      console.error('Error al cambiar logo:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar la imagen');
    }
  };

  const handleGuardar = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    // Validaciones
    if (!nombreEmpresa.trim()) {
      Alert.alert('Error', 'El nombre de la empresa es obligatorio');
      return;
    }

    if (!categorias) {
      Alert.alert('Error', 'La categoría es obligatoria');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }

    if (!tamanioEmpresa) {
      Alert.alert('Error', 'El tamaño de empresa es obligatorio');
      return;
    }

    setSaving(true);

    try {
      const datosActualizar = {
        usuario_id: userId,
        accion: 'actualizarDatos',
        nombre_empresa: nombreEmpresa.trim(),
        categorias,
        descripcion: descripcion.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        anio_fundacion: anioFundacion,
        tamanio_empresa: tamanioEmpresa,
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
        Alert.alert('Éxito', data.message || 'Información actualizada correctamente');
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar información');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const getCompanyInitials = (nombre) => {
    if (!nombre) return 'E';
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear; year++) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    return years.reverse();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando información...</Text>
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
          Completa la información básica de tu empresa para que los candidatos te conozcan mejor
        </Text>

        {/* Logo Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Building size={24} color="#2563eb" />
            </View>
            <Text style={styles.sectionTitle}>Logo de la Empresa</Text>
          </View>

          <View style={styles.logoSection}>
            <TouchableOpacity style={styles.logoContainer} onPress={handleCambiarLogo}>
              {logo ? (
                <Image source={{ uri: logo }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>{getCompanyInitials(nombreEmpresa)}</Text>
                </View>
              )}
              <View style={styles.logoEditIcon}>
                <Camera size={16} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.logoHint}>Toca para cambiar el logo</Text>
          </View>
        </View>

        {/* Información Básica */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la empresa *</Text>
            <TextInput
              style={styles.textInput}
              value={nombreEmpresa}
              onChangeText={setNombreEmpresa}
              placeholder="Nombre de tu empresa"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categorias}
                onValueChange={setCategorias}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una categoría" value="" />
                {categoriasList.map((categoria, index) => (
                  <Picker.Item label={categoria} value={categoria} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="empresa@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.textInput}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+52 662 123 4567"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Año de fundación</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={anioFundacion}
                  onValueChange={setAnioFundacion}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona el año" value="" />
                  {generateYearOptions().map((year, index) => (
                    <Picker.Item label={year.label} value={year.value} key={index} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Tamaño *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tamanioEmpresa}
                  onValueChange={setTamanioEmpresa}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona" value="" />
                  {tamañosList.map((tamaño, index) => (
                    <Picker.Item label={tamaño.label} value={tamaño.value} key={index} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe tu empresa, misión, visión y valores..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.charCount}>
              {descripcion.length}/500 caracteres
            </Text>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumen del perfil</Text>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={nombreEmpresa ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: nombreEmpresa ? '#10b981' : '#9ca3af' }]}>
              Nombre de empresa {nombreEmpresa ? '✓' : '(pendiente)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={categorias ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: categorias ? '#10b981' : '#9ca3af' }]}>
              Categoría {categorias ? '✓' : '(pendiente)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={email ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: email ? '#10b981' : '#9ca3af' }]}>
              Email {email ? '✓' : '(pendiente)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={tamanioEmpresa ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: tamanioEmpresa ? '#10b981' : '#9ca3af' }]}>
              Tamaño {tamanioEmpresa ? '✓' : '(pendiente)'}
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
              <Text style={styles.saveButtonText}>Guardar Información</Text>
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
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  logoEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  logoHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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
    height: 100,
    textAlignVertical: 'top',
    maxLength: 500,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
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