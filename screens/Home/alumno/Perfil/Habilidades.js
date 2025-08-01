import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Brain, Code, X, CheckCircle } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Habilidades () {
    const [habilidadesBlandas, setHabilidadesBlandas] = useState([]);
    const [habilidadBlanda, setHabilidadBlanda] = useState('');

    const [habilidadesTecnicas, setHabilidadesTecnicas] = useState([]);
    const [habilidadTecnica, setHabilidadTecnica] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);

    const opcionesBlandas = [
        'Autodidacta', 'Trabajo en equipo', 'Pensamiento crítico', 'Habilidad para dar y recibir retroalimentación',
    'Networking', 'Gestión del tiempo', 'Responsabilidad', 'Resiliencia', 'Adaptabilidad', 'Automotivación',
    'Gestión del estrés', 'Actitud positiva', 'Creatividad', 'Comunicación efectiva', 'Escucha activa', 'Empatía',
    'Lenguaje corporal', 'Claridad al hablar y escribir', 'Asertividad', 'Capacidad de persuasión', 'Colaboración',
    'Tolerancia', 'Manejo de conflictos', 'Liderazgo', 'Inteligencia emocional', 'Resolución de problemas',
    'Pensamiento analítico', 'Pensamiento estratégico', 'Capacidad de aprender de errores'
    ];

    const opcionesTecnicas = [
    'Python', 'JavaScript', 'PHP', 'C++', 'Java', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'HTML', 'CSS', 'SASS', 'React',
    'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Laravel', 'Django', 'Flask', 'Spring',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'CI/CD',
    'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'After Effects'
    ];

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            if (id) {
                setUserId(id);
                await cargarHabilidades(id);
            } else {
                Alert.alert('Error', 'No se encontro el ID del usuario');
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            Alert.alert('Error', 'Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const cargarHabilidades = async (usuario_id) => {
        try {
            const response = await fetch();
            const data = await response.json();

            if (data.success) {
                setHabilidadesBlandas(data.habilidades_blandas || []);
                setHabilidadesTecnicas(data.habilidades_tecnicas || []);
            }
        } catch (error) {
            console.error('Error al cargar habilidades:', error);
        }
    };

    const agregarHabilidad = (tipo, habilidad) => {
        if (!habilidad) return;

        if (tipo === 'blanda' && habilidadesBlandas.length < 5 && !habilidadesBlandas.includes(habilidad)) {
            setHabilidadesBlandas([...habilidadesBlandas, habilidad]);
            setHabilidadBlanda('');
        } else if (tipo === 'tecnica' && habilidadesTecnicas.length < 10 && !habilidadesTecnicas.includes(habilidad)) {
            setHabilidadesTecnicas([...habilidadesTecnicas, habilidad]);
            setHabilidadTecnica('');
        }
    };

    const eliminarHabilidad = (tipo, habilidad) => {
        if (tipo === 'blanda') {
            setHabilidadesBlandas(habilidadesBlandas.filter(item => item !== habilidad));
        } else {
            setHabilidadesTecnicas(habilidadesTecnicas.filter(item => item !== habilidad));
        }
    };

    const handleGuardar = async () => {
        if (!userId) {
            Alert.alert('Error', 'No se encontro el ID del usuario');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(``, {
                method: 'POST',
                headers: {

                },
                body: JSON.stringify({
                    
                }),
            });
            
            const data = await response.json();

            if (data.success) {
                Alert.alert('Exito', data.message || 'Habilidades guardadas correctamente');
            } else {
                Alert.alert('Error', data.message || 'Error al guardar habilidades');
            }
        } catch (error) {
            console.error('Error al guardar habilidades:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando habilidades...</Text>
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
          Destaca tus habilidades más fuertes para que las empresas identifiquen tu potencial
        </Text>

        {/* Habilidades Blandas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Brain size={24} color="#7c3aed" />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Habilidades Blandas</Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona hasta 5 habilidades ({habilidadesBlandas.length}/5)
              </Text>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={habilidadBlanca}
              onValueChange={(itemValue) => {
                setHabilidadBlanca(itemValue);
                agregarHabilidad('blanda', itemValue);
              }}
              style={styles.picker}
              enabled={habilidadesBlandas.length < 5}
            >
              <Picker.Item label="Selecciona una habilidad..." value="" />
              {opcionesBlandas.map((item, index) => (
                <Picker.Item 
                  label={item} 
                  value={item} 
                  key={index}
                  enabled={!habilidadesBlandas.includes(item)}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.tagsContainer}>
            {habilidadesBlandas.map((habilidad, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, styles.tagBlanda]}
                onPress={() => eliminarHabilidad('blanda', habilidad)}
              >
                <Text style={styles.tagTextBlanda}>{habilidad}</Text>
                <X size={16} color="#7c3aed" />
              </TouchableOpacity>
            ))}
            {habilidadesBlandas.length === 0 && (
              <Text style={styles.emptyText}>No has seleccionado habilidades blandas</Text>
            )}
          </View>
        </View>

        {/* Habilidades Técnicas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#dbeafe' }]}>
              <Code size={24} color="#2563eb" />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona hasta 10 habilidades ({habilidadesTecnicas.length}/10)
              </Text>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={habilidadTecnica}
              onValueChange={(itemValue) => {
                setHabilidadTecnica(itemValue);
                agregarHabilidad('tecnica', itemValue);
              }}
              style={styles.picker}
              enabled={habilidadesTecnicas.length < 10}
            >
              <Picker.Item label="Selecciona una habilidad..." value="" />
              {opcionesTecnicas.map((item, index) => (
                <Picker.Item 
                  label={item} 
                  value={item} 
                  key={index}
                  enabled={!habilidadesTecnicas.includes(item)}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.tagsContainer}>
            {habilidadesTecnicas.map((habilidad, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, styles.tagTecnica]}
                onPress={() => eliminarHabilidad('tecnica', habilidad)}
              >
                <Text style={styles.tagTextTecnica}>{habilidad}</Text>
                <X size={16} color="#2563eb" />
              </TouchableOpacity>
            ))}
            {habilidadesTecnicas.length === 0 && (
              <Text style={styles.emptyText}>No has seleccionado habilidades técnicas</Text>
            )}
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={habilidadesBlandas.length > 0 ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: habilidadesBlandas.length > 0 ? '#10b981' : '#9ca3af' }]}>
              {habilidadesBlandas.length} habilidades blandas seleccionadas
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <CheckCircle size={20} color={habilidadesTecnicas.length > 0 ? '#10b981' : '#9ca3af'} />
            <Text style={[styles.summaryText, { color: habilidadesTecnicas.length > 0 ? '#10b981' : '#9ca3af' }]}>
              {habilidadesTecnicas.length} habilidades técnicas seleccionadas
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
            <Text style={styles.saveButtonText}>Guardar Habilidades</Text>
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
    backgroundColor: '#f3e8ff',
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
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 40,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagBlanda: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  tagTecnica: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  tagTextBlanda: {
    color: '#7c3aed',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  tagTextTecnica: {
    color: '#2563eb',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  emptyText: {
    color: '#9ca3af',
    fontStyle: 'italic',
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 8,
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
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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