import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Switch,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {  Plus, Trash2, Calendar } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

//Colocar la conexion a la API
//const API_BASE =

export default function Educacion() {
    const [educaciones, setEducaciones] = useState([
        {
            id: 0,
            titulo: '',
            nivel: '',
            fecha_Inicio: null,
            fecha_Fin: null,
            estudia_Actualmente: false,
            mostrarPickerInicio: false,
            mostrarPickerFin: false,
        },
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        cargarDatosUsuarios();
    }, []);

    const cargarDatosUsuarios = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            if (id) {
                setUserId(id);
                await cargarEducacion(id);
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

    const cargarEducacion = async (usuario_id) => {
        try {
            
        } catch (error) {
            console.error('Error al cargar educacion:', error);
        }
    };

    const agregarEducacion = () => {
        setEducaciones([
            ...educaciones,
            {
                id: 0,
                titulo: '',
                nivel: '',
                fecha_Inicio: null,
                fecha_Fin: null,
                estudia_Actualmente: false,
                mostrarPickerInicio: false,
                mostrarPickerFin: false,
            },
        ]);
    };

    const eliminarEducacion = (index) => {
        if (educaciones.length > 1) {
            const nuevaLista = [...educaciones];
            nuevaLista.splice(index, 1);
            setEducaciones(nuevaLista);
        }
    };

    const manejarCambio = (index,campo, valor) => {
        const nuevaLista = [...educaciones];
        nuevaLista[index][campo] = valor;
        setEducaciones(nuevaLista);
    };
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-MX');
    };

    const handleGuardar =async () => {
        if (!userId) {
            Alert.alert('Error', 'No se encontro el ID del usuario');
            return;
        }

        //Validacion de educacion de titulo y nivel
        const educacionesValidas = educaciones.filter(edu =>
            edu.titulo.trim() && edu.nivel.trim()
        );

        if (educacionesValidas.length === 0) {
            Alert.alert('Error', 'Debes agregar al menos una educacion con titulo y nivel');
            return;
        }

        setSaving(true);

        try {
            const educacionesParaEnviar = educacionesValidas.map(edu => ({
                id: edu.id,
                titulo: edu.titulo.trim(),
                nivel: edu.nivel,
                fecha_Inicio: edu.fecha_Inicio ? edu.fecha_Inicio.toISOString().split('T')[0] : '',
                fecha_Fin: edu.fecha_Fin && !edu.estudia_Actualmente ? edu.fecha_Fin.toISOString().split('T')[0]: '',
                estudia_Actualmente: edu.estudia_Actualmente,
            }));

            const response = await fetch(`${API_BASE}/`,{
                method: 'POST',
                headers: {

                },
                body: JSON.stringify({
                    usuario_id: parseInt(userId),
                    educacion: educacionesParaEnviar,
                }),
        });
            const data = await response.json();
            if (data.success) {
                Alert.alert('Exito', data.message || 'Educacion guardada correctamente');
                //Recargar datos
                await cargarEducacion(userId);
            } else {
                Alert.alert('Error', data.message || 'Error al guardar educacion');
            }
        } catch (error) {
            console.error('Error al guardar educacion:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color='#2561eb'/>
                <Text style= {styles.loadingText}>Cargando educacion</Text>
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
          Agrega tu información académica para que las empresas conozcan tu formación
        </Text>

        {educaciones.map((edu, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Educación {index + 1}</Text>
              {educaciones.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => eliminarEducacion(index)}
                >
                  <Trash2 size={20} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título del programa</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Licenciatura en Ingeniería de Software"
                value={edu.titulo}
                onChangeText={(text) => manejarCambio(index, 'titulo', text)}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nivel de estudios</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={edu.nivel}
                  onValueChange={(value) => manejarCambio(index, 'nivel', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona el nivel" value="" />
                  <Picker.Item label="Certificación" value="certificacion" />
                  <Picker.Item label="Bachillerato" value="bachillerato" />
                  <Picker.Item label="Técnico" value="tecnico" />
                  <Picker.Item label="Licenciatura" value="licenciatura" />
                  <Picker.Item label="Maestría" value="maestria" />
                  <Picker.Item label="Doctorado" value="doctorado" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de inicio</Text>
              <TouchableOpacity
                onPress={() => manejarCambio(index, 'mostrarPickerInicio', true)}
                style={styles.dateButton}
              >
                <Calendar size={20} color="#0369a1" />
                <Text style={styles.dateButtonText}>
                  {edu.fechaInicio ? formatearFecha(edu.fechaInicio) : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
              {edu.mostrarPickerInicio && (
                <DateTimePicker
                  value={edu.fechaInicio ? new Date(edu.fechaInicio) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    manejarCambio(index, 'mostrarPickerInicio', false);
                    if (date) manejarCambio(index, 'fechaInicio', date);
                  }}
                />
              )}
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchContent}>
                <Text style={styles.switchLabel}>¿Estudias actualmente?</Text>
                <Text style={styles.switchSubtext}>
                  Marca esta opción si aún estás cursando
                </Text>
              </View>
              <Switch
                value={edu.estudiaActualmente}
                onValueChange={(valor) => manejarCambio(index, 'estudiaActualmente', valor)}
                trackColor={{ false: '#f3f4f6', true: '#dbeafe' }}
                thumbColor={edu.estudiaActualmente ? '#2563eb' : '#9ca3af'}
              />
            </View>

            {!edu.estudiaActualmente && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de finalización</Text>
                <TouchableOpacity
                  onPress={() => manejarCambio(index, 'mostrarPickerFin', true)}
                  style={styles.dateButton}
                >
                  <Calendar size={20} color="#0369a1" />
                  <Text style={styles.dateButtonText}>
                    {edu.fechaFin ? formatearFecha(edu.fechaFin) : 'Seleccionar fecha'}
                  </Text>
                </TouchableOpacity>
                {edu.mostrarPickerFin && (
                  <DateTimePicker
                    value={edu.fechaFin ? new Date(edu.fechaFin) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      manejarCambio(index, 'mostrarPickerFin', false);
                      if (date) manejarCambio(index, 'fechaFin', date);
                    }}
                  />
                )}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={agregarEducacion}>
          <Plus size={20} color="#2563eb" />
          <Text style={styles.addButtonText}>Agregar otra educación</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleGuardar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Información</Text>
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
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
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
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
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
  dateButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#0369a1',
    fontWeight: '500',
    marginLeft: 8,
  },
  switchContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  switchSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 8,
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
})