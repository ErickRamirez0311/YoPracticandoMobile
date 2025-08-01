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
import { 
  Globe, 
  Save, 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = '';

export default function RedesSociales() {
  const [paginaWeb, setPaginaWeb] = useState('');
  const [x, setX] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        await cargarRedesSociales(id);
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

  const cargarRedesSociales = async (usuario_id) => {
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
        setPaginaWeb(empresa.pagina_web || '');
        setX(empresa.x || '');
        setTiktok(empresa.tiktok || '');
        setFacebook(empresa.facebook || '');
        setInstagram(empresa.instagram || '');
      }
    } catch (error) {
      console.error('Error al cargar redes sociales:', error);
    }
  };

  const validarURL = (url) => {
    if (!url) return true; // URLs vacías son válidas
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
  };

  const formatearURL = (url, dominio = '') => {
    if (!url) return '';
    
    // Si ya tiene protocolo, devolverla tal como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es solo el username/handle, construir la URL completa
    if (dominio && !url.includes('.')) {
      return `https://${dominio}/${url.replace('@', '')}`;
    }
    
    // Si no tiene protocolo pero parece una URL completa, agregar https
    if (url.includes('.')) {
      return `https://${url}`;
    }
    
    return url;
  };

  const abrirEnlace = async (url) => {
    if (!url) {
      Alert.alert('Error', 'No hay enlace configurado');
      return;
    }

    const urlFormateada = formatearURL(url);
    
    try {
      const canOpen = await Linking.canOpenURL(urlFormateada);
      if (canOpen) {
        await Linking.openURL(urlFormateada);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al abrir el enlace');
    }
  };

  const handleGuardar = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    // Validar URLs antes de guardar
    const urls = [
      { name: 'Página web', value: paginaWeb },
      { name: 'X', value: x },
      { name: 'TikTok', value: tiktok },
      { name: 'Facebook', value: facebook },
      { name: 'Instagram', value: instagram },
    ];

    for (const url of urls) {
      if (url.value && !validarURL(url.value)) {
        Alert.alert('Error', `La URL de ${url.name} no es válida`);
        return;
      }
    }

    setSaving(true);

    try {
      const datosActualizar = {
        usuario_id: userId,
        accion: 'actualizarDatos',
        pagina_web: formatearURL(paginaWeb),
        x: formatearURL(x, 'x.com'),
        tiktok: formatearURL(tiktok, 'tiktok.com'),
        facebook: formatearURL(facebook, 'facebook.com'),
        instagram: formatearURL(instagram, 'instagram.com'),
      };

      const response = await fetch(`${API_BASE}/empresa.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizar),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', data.message || 'Redes sociales actualizadas correctamente');
        // Actualizar los estados con las URLs formateadas
        setPaginaWeb(datosActualizar.pagina_web);
        setX(datosActualizar.x);
        setTiktok(datosActualizar.tiktok);
        setFacebook(datosActualizar.facebook);
        setInstagram(datosActualizar.instagram);
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar redes sociales');
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
        <Text style={styles.loadingText}>Cargando redes sociales...</Text>
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
          Conecta tus redes sociales para que los candidatos conozcan más sobre tu empresa
        </Text>

        {/* Página Web */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#dbeafe' }]}>
              <Globe size={24} color="#2563eb" />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Página Web</Text>
              <Text style={styles.sectionSubtitle}>Sitio web oficial de tu empresa</Text>
            </View>
            {paginaWeb && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={() => abrirEnlace(paginaWeb)}
              >
                <ExternalLink size={16} color="#2563eb" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL del sitio web</Text>
            <TextInput
              style={styles.textInput}
              value={paginaWeb}
              onChangeText={setPaginaWeb}
              placeholder="https://www.miempresa.com"
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.hint}>Incluye https:// al inicio de la URL</Text>
          </View>
        </View>

        {/* Redes Sociales */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#dcfce7' }]}>
              <LinkIcon size={24} color="#16a34a" />
            </View>
            <Text style={styles.sectionTitle}>Redes Sociales</Text>
          </View>

          {/* X (Twitter) */}
          <View style={styles.socialInputGroup}>
            <View style={styles.socialHeader}>
              <Text style={[styles.socialIcon, { color: '#000000' }]}>𝕏</Text>
              <View style={styles.socialInfo}>
                <Text style={styles.socialName}>X (Twitter)</Text>
                <Text style={styles.socialDescription}>Red social de microblogging</Text>
              </View>
              {x && (
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => abrirEnlace(x)}
                >
                  <ExternalLink size={16} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.socialInput}
              value={x}
              onChangeText={setX}
              placeholder="https://x.com/miempresa o @miempresa"
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Facebook */}
          <View style={styles.socialInputGroup}>
            <View style={styles.socialHeader}>
              <Text style={[styles.socialIcon, { color: '#1877f2' }]}>f</Text>
              <View style={styles.socialInfo}>
                <Text style={styles.socialName}>Facebook</Text>
                <Text style={styles.socialDescription}>Red social principal</Text>
              </View>
              {facebook && (
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => abrirEnlace(facebook)}
                >
                  <ExternalLink size={16} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.socialInput}
              value={facebook}
              onChangeText={setFacebook}
              placeholder="https://facebook.com/miempresa"
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Instagram */}
          <View style={styles.socialInputGroup}>
            <View style={styles.socialHeader}>
              <Text style={[styles.socialIcon, { color: '#e4405f' }]}>📷</Text>
              <View style={styles.socialInfo}>
                <Text style={styles.socialName}>Instagram</Text>
                <Text style={styles.socialDescription}>Fotos y contenido visual</Text>
              </View>
              {instagram && (
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => abrirEnlace(instagram)}
                >
                  <ExternalLink size={16} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.socialInput}
              value={instagram}
              onChangeText={setInstagram}
              placeholder="https://instagram.com/miempresa o @miempresa"
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* TikTok */}
          <View style={styles.socialInputGroup}>
            <View style={styles.socialHeader}>
              <Text style={[styles.socialIcon, { color: '#000000' }]}>🎵</Text>
              <View style={styles.socialInfo}>
                <Text style={styles.socialName}>TikTok</Text>
                <Text style={styles.socialDescription}>Videos cortos y entretenimiento</Text>
              </View>
              {tiktok && (
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => abrirEnlace(tiktok)}
                >
                  <ExternalLink size={16} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.socialInput}
              value={tiktok}
              onChangeText={setTiktok}
              placeholder="https://tiktok.com/@miempresa o @miempresa"
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={styles.tipsTitle}>Consejos</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Puedes usar URLs completas o solo el nombre de usuario</Text>
            <Text style={styles.tipItem}>• Las redes sociales ayudan a mostrar la cultura de tu empresa</Text>
            <Text style={styles.tipItem}>• Mantén activas las cuentas que agregues</Text>
            <Text style={styles.tipItem}>• No es obligatorio completar todas las redes</Text>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Estado de tus redes</Text>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={paginaWeb ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: paginaWeb ? '#10b981' : '#9ca3af' }]}>
              Página web {paginaWeb ? '✓' : '(opcional)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={facebook ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: facebook ? '#10b981' : '#9ca3af' }]}>
              Facebook {facebook ? '✓' : '(opcional)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={instagram ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: instagram ? '#10b981' : '#9ca3af' }]}>
              Instagram {instagram ? '✓' : '(opcional)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={x ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: x ? '#10b981' : '#9ca3af' }]}>
              X (Twitter) {x ? '✓' : '(opcional)'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={tiktok ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: tiktok ? '#10b981' : '#9ca3af' }]}>
              TikTok {tiktok ? '✓' : '(opcional)'}
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
              <Text style={styles.saveButtonText}>Guardar Redes Sociales</Text>
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
  testButton: {
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  inputGroup: {
    marginBottom: 16,
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
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  socialInputGroup: {
    marginBottom: 20,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  socialInfo: {
    flex: 1,
  },
  socialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  socialDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  socialInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginLeft: 44,
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