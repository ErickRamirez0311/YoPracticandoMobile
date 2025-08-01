import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Plus,
    Trash2,
    Calendar,
    Award,
    FileText
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Reconocimientos() {
    const [reconocimientos, setReconocimientos] = useState([
        { id: 0, titulo: '', fecha: '', mostrandoFecha: false },
    ]);
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
                await cargarReconocimientos(id);
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

    const cargarReconocimientos = async (usuario_id) => {
        try {
            const response = await fetch(``);
            const data = await response.json();

            if (data.success && data.reconocimientos.length > 0) {
                const reconocimientosFormateados = data.reconocimientos.map(rec => ({
                    id: rec.id,
                    titulo: rec.titulo || '',
                    fecha: rec.fecha_otorgamiento ? new Date(rec.fecha_otorgamiento).toLocaleDateString('es-ES'): '',
                    descripcion: rec.descripcion || '',
                    mostrandoFecha: false,
                }));
                setReconocimientos(reconocimientosFormateados);
            } 
        } catch (error) {
            console.error('Error al cargar reconocimientos:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const nuevos = [...reconocimientos];
        nuevos[index][field] = value;
        setReconocimientos(nuevos);
    };

    const handleDateChange = (index, event, selectedDate) => {
        const fecha = selectedDate || new Date();
        const nuevos = [...reconocimientos];
        nuevos[index].fecha = formatDate(fecha);
        nuevos[index].mostrandoFecha = false;
        setReconocimientos(nuevos);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = d.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    const agregarReconocimiento = () => {
        setReconocimientos([
            ...reconocimientos,
            { id: 0, titulo: '', fecha: '', descripcion: '', mostrandoFecha: false },
        ]);
    };

    const eliminarReconocimiento = (index) => {
        if (reconocimientos.length > 1) {
            const nuevos = [...reconocimientos];
            nuevos.splice(index, 1);
            setReconocimientos(nuevos);
        }
    };
    
    const handleGuardar = async () => {
        if (!userId) {
            Alert.alert('Error', 'No se encontro el ID del usuario');
            return;
        }

        //Validar que al menos el primer reconocimiento tenga un titulo
        const reconocimientosValidos = reconocimientos.filter(rec =>
            rec.titulo.trim()
        );

        if (reconocimientosValidos.length === 0) {
            Alert.alert('Error', 'Debes agregar al menos un reconocimiento con un titulo');
            return;
        }

        setSaving(true);

        try {
            const reconocimientosParaEnviar = reconocimientosValidos.map(rec => ({
                id: rec.id,
                titulo: rec.titulo.trim(),
                fecha: rec.fecha,
                descripcion: rec.descripcion.trim(),
            }));

            const response = await fetch(``, {
                method: 'POST',
                headers: {

                },
                body: JSON.stringify({
                    usuario_id: parseInt(userId),
                    reconocimientos: reconocimientosParaEnviar,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Exito', data.message || 'Reconocimientos guardados correctamente');
                //Recargar datos
                await cargarReconocimientos(userId);
            } else {
                Alert.alert('Error', data.message || 'Error al guardar reconocimientos');
            }
        } catch (error) {
            console.error('Error al guardar reconocimientos', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff" />

                <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.subtitle}>
                        Destaca tus logros, certificaciones y reconocimientos para mostrar tu excelencia
                    </Text>

                    {reconocimientos.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitleContainer}>
                                    <View style={styles.iconContainer}>
                                        <Award size={20} color="#f59e0b" />
                                    </View>
                                    <Text style={styles.cardTitle}>Reconocimiento {index + 1}</Text>
                                </View>
                                {reconocimientos.length > 1 && (
                                    <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => eliminarReconocimiento(index)}
                                    >
                                        <Trash2 size={18} color="#dc2626" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Titulo del reconocimiento *</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Ej. Premio a la Excelencia Académica"
                                value={item.titulo}
                                onChangeText={(text) => handleChange(index, 'titulo', text)}
                                placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Fecha de otorgamiento</Text>
                                <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => handleChange(index, 'mostrandoFecha', true)}
                                >
                                    <Calendar size={20} color="#0369a1" />
                                    <Text style={[
                                        styles.dateButtonText,
                                        { color: item.fecha ? '#0369a1': '#9ca3af' }
                                    ]}>
                                        {item.fecha || 'Seleccionar fecha'}
                                    </Text>
                                </TouchableOpacity>
                                {item.mostrandoFecha && (
                                    <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => handleDateChange(index, event, date)}
                                    />
                                )}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Descripcion</Text>
                                <TextInput 
                                style={[styles.input, styles.textArea]}
                                multiline
                                numberOfLines={4}
                                placeholder="Describe brevemente el reconocimiento, la institución que lo otorgó y su importancia..."
                                value={item.descripcion}
                                onChangeText={(text) => handleChange(index, 'descripcion', text)}
                                placeholderTextColor="#9ca3af"
                                textAlignVertical="top"
                                />
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addButton} onPress={agregarReconocimiento}>
                        <Plus size={20} color="#f59e0b" />
                        <Text style={styles.dateButtonText}>Agregar otro reconocimiento</Text>
                    </TouchableOpacity>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoHeader}>
                            <FileText size={20} color="#6366f1" />
                            <Text style={styles.infoTitle}>¿Que incluir?</Text>
                        </View>
                        <View style={styles.infoList}>
                            <Text style={styles.infoItem}>• Certificaciones profesionales</Text>
                            <Text style={styles.infoItem}>• Premios académicos o laborales</Text>
                            <Text style={styles.infoItem}>• Reconocimientos por proyectos</Text>
                            <Text style={styles.infoItem}>• Distinciones especiales</Text>
                            <Text style={styles.infoItem}>• Menciones honoríficas</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                    onPress={handleGuardar}
                    disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#ffffff" size="small"/>
                        ) : (
                            <Text style={styles.saveButtonText}>Guardar Reconocimientos</Text>
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
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    fontWeight: '500',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  infoList: {
    paddingLeft: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
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
}

