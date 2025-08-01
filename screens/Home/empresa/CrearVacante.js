import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  X,
  ChevronDown,
  Search,
  Calendar,
  DollarSign,
} from 'lucide-react-native';

const CATEGORIAS = [
  'Económicas y Administrativas',
  'Ciencias Exactas y Naturales',
  'Ingeniería',
  'Ciencias Sociales',
  'Ciencias Biológicas y de Salud',
  'Humanidades y Artes'
];

const TIPOS_VACANTE = [
  'Prácticas',
  'Servicio Social'
];

const CARRERAS = [
  // UNISON
  'Arquitectura', 'Ing. Agrónomo', 'Ing. Biomédica', 'Ing. Civil',
  'Ing. en Ciencias Ambientales', 'Ing. en Energías Renovables',
  'Ing. en Materiales', 'Ing. en Semiconductores', 'Ing. en Sistemas de Información',
  'Ing. en Tecnología Electrónica', 'Ing. Industrial y de Sistemas',
  'Ing. Mecatrónica', 'Ing. Metalúrgica', 'Ing. Minero', 'Ing. Químico',
  'Químico en Alimentos', 'Administración', 'Administración Pública',
  'Antropología', 'Artes Escénicas', 'Artes Plásticas', 'Biología',
  'Ciencias de la Computación', 'Ciencias de la Comunicación',
  'Ciencias Genómicas', 'Ciencias Nutricionales', 'Contaduría Pública',
  'Cultura Física y Deporte', 'Derecho', 'Diseño Gráfico', 'Economía',
  'Educación', 'Enseñanza del Inglés', 'Finanzas', 'Física',
  'Física Medica', 'Fisioterapia', 'Geología', 'Historia', 'Lingüística',
  'Literaturas Hispánicas', 'Logística', 'Matemáticas', 'Mercadotecnia',
  'Música', 'Negocios y Comercio Internacionales', 'Odontología',
  'Psicología', 'Química', 'Seguridad Pública', 'Sociología',
  'Sustentabilidad', 'Trabajo Social', 'Turismo', 'Medicina',
  'Médico Veterinario Zootecnista', 'Químico Biólogo Clínico',
  // UES
  'Tecnología de alimentos', 'Software', 'Industrial en manufactura',
  'Horticultura', 'Geociencias', 'Biotecnología Acuática', 'Ing. Ambiental',
  'Administración De Empresas', 'Administración De Empresas Turísticas',
  'Agro Negocio', 'Comercio Internacional', 'Contaduría', 'Criminología',
  'Ecología', 'Entrenamiento Deportivo', 'Finanzas E Inversiones',
  'Gestión Y Desarrollo De Negocios', 'Medicina General', 'Nutrición Humana',
  // UNIDEP
  'Manufactura y Robótica', 'Sistemas Computacionales', 'Pedagogía',
  'Administración de Tecnologías de la Información',
  // TEC
  'Tecnologías Computacionales', 'Innovación y Desarrollo',
  'Estrategia y Transformación de Negocios', 'Negocios Internacionales', 'Diseño',
  // TECMILENIO
  'Logística y cadena de suministro', 'Ing. Industrial',
  'Creación y desarrollo de empresas', 'Contabilidad y estrategia financiera',
  'Desarrollo de Software', 'Gastronomía internacional',
  'Diseño gráfico y animación'
];

const MODALIDADES = [
  { key: 'medio_tiempo', label: 'Medio tiempo' },
  { key: 'tiempo_completo', label: 'Tiempo completo' },
  { key: 'remoto', label: 'Remoto' },
  { key: 'hibrido', label: 'Híbrido' }
];

const CIUDADES = ['Hermosillo'];

const CANTIDADES = [
  { key: '1', label: '1 persona' },
  { key: '2', label: '2 personas' },
  { key: '3', label: '3 personas' },
  { key: '4', label: '4 personas' },
  { key: '5', label: '5 personas' },
  { key: 'mas', label: 'Más de 5 personas' }
];

const DIAS_CIERRE = [
  { key: '15', label: '15 días' },
  { key: '30', label: '30 días' },
  { key: '45', label: '45 días' },
  { key: '60', label: '60 días' },
  { key: '90', label: '90 días' }
];

export default function CrearVacante({ navigation }) {
  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    tipo: '',
    ciudad: '',
    descripcion: '',
    cantidad: '',
    diasCierre: '',
    tipoPago: 'rango',
    moneda: 'MXN',
    salarioMinimo: '',
    salarioMaximo: '',
    salarioFijo: '',
    tipoTarifa: 'mes'
  });

  // Estados para tags
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState([]);
  const [modalidadesSeleccionadas, setModalidadesSeleccionadas] = useState([]);

  // Estados para modals
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showCarreraModal, setShowCarreraModal] = useState(false);
  const [showModalidadModal, setShowModalidadModal] = useState(false);
  const [showCiudadModal, setShowCiudadModal] = useState(false);
  const [showCantidadModal, setShowCantidadModal] = useState(false);
  const [showDiasCierreModal, setShowDiasCierreModal] = useState(false);
  const [showTipoTarifaModal, setShowTipoTarifaModal] = useState(false);

  // Estados para búsqueda
  const [searchCarrera, setSearchCarrera] = useState('');

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [fechaExpiracion, setFechaExpiracion] = useState('');

  // Estados para mostrar/ocultar remuneración
  const [showRemuneracion, setShowRemuneracion] = useState(true);

  useEffect(() => {
    // Mostrar/ocultar remuneración según tipo de vacante
    setShowRemuneracion(formData.tipo !== 'Servicio Social');
  }, [formData.tipo]);

  useEffect(() => {
    // Calcular fecha de expiración cuando cambian los días de cierre
    if (formData.diasCierre) {
      const fechaActual = new Date();
      const dias = parseInt(formData.diasCierre);
      const fechaExp = new Date(fechaActual);
      fechaExp.setDate(fechaActual.getDate() + dias);
      
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                     'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const dia = fechaExp.getDate();
      const mes = meses[fechaExp.getMonth()];
      const año = fechaExp.getFullYear();
      
      setFechaExpiracion(`${dia} ${mes} ${año}`);
    } else {
      setFechaExpiracion('');
    }
  }, [formData.diasCierre]);

  useEffect(() => {
    // Contar palabras en la descripción
    const words = formData.descripcion.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [formData.descripcion]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al actualizarlo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addCarrera = (carrera) => {
    if (carrerasSeleccionadas.length >= 5) {
      Alert.alert('Límite alcanzado', 'Solo puedes seleccionar un máximo de 5 carreras');
      return;
    }
    if (!carrerasSeleccionadas.includes(carrera)) {
      setCarrerasSeleccionadas(prev => [...prev, carrera]);
    }
    setShowCarreraModal(false);
    setSearchCarrera('');
  };

  const removeCarrera = (carrera) => {
    setCarrerasSeleccionadas(prev => prev.filter(c => c !== carrera));
  };

  const addModalidad = (modalidad) => {
    if (!modalidadesSeleccionadas.includes(modalidad.key)) {
      setModalidadesSeleccionadas(prev => [...prev, modalidad.key]);
    }
    setShowModalidadModal(false);
  };

  const removeModalidad = (modalidadKey) => {
    setModalidadesSeleccionadas(prev => prev.filter(m => m !== modalidadKey));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';
    if (!formData.tipo) newErrors.tipo = 'El tipo de vacante es obligatorio';
    if (!formData.ciudad) newErrors.ciudad = 'La ciudad es obligatoria';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!formData.diasCierre) newErrors.diasCierre = 'Los días de cierre son obligatorios';
    if (modalidadesSeleccionadas.length === 0) newErrors.modalidades = 'Seleccione al menos una modalidad';

    // Validar descripción (límite de palabras)
    if (wordCount > 500) {
      newErrors.descripcion = 'La descripción excede el límite de 500 palabras';
    }

    // Validar remuneración si es necesaria
    if (showRemuneracion) {
      if (!formData.moneda) newErrors.moneda = 'La moneda es obligatoria';
      if (!formData.tipoTarifa) newErrors.tipoTarifa = 'El tipo de tarifa es obligatorio';
      
      if (formData.tipoPago === 'rango') {
        if (!formData.salarioMinimo) newErrors.salarioMinimo = 'El salario mínimo es obligatorio';
        if (!formData.salarioMaximo) newErrors.salarioMaximo = 'El salario máximo es obligatorio';
        if (formData.salarioMinimo && formData.salarioMaximo && 
            parseFloat(formData.salarioMinimo) >= parseFloat(formData.salarioMaximo)) {
          newErrors.salarioMaximo = 'El salario máximo debe ser mayor al mínimo';
        }
      } else {
        if (!formData.salarioFijo) newErrors.salarioFijo = 'El salario fijo es obligatorio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Vacante Creada',
        'La vacante ha sido publicada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos obligatorios');
    }
  };

  const filteredCarreras = CARRERAS.filter(carrera =>
    carrera.toLowerCase().includes(searchCarrera.toLowerCase())
  );

  const getModalidadLabel = (key) => {
    const modalidad = MODALIDADES.find(m => m.key === key);
    return modalidad ? modalidad.label : key;
  };

  const SelectModal = ({ visible, title, data, onSelect, onClose, keyField = 'key', labelField = 'label' }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => typeof item === 'string' ? item : (item[keyField] || index.toString())}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalItemText}>
                  {typeof item === 'string' ? item : item[labelField]}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.modalList}
          />
        </View>
      </View>
    </Modal>
  );

  const CarreraModal = () => (
    <Modal visible={showCarreraModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Carrera</Text>
            <TouchableOpacity onPress={() => setShowCarreraModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar carrera..."
              value={searchCarrera}
              onChangeText={setSearchCarrera}
            />
          </View>
          <FlatList
            data={filteredCarreras}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => addCarrera(item)}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.modalList}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información Básica */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información básica</Text>
          
          {/* Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título de la vacante *</Text>
            <TextInput
              style={[styles.input, errors.titulo && styles.inputError]}
              value={formData.titulo}
              onChangeText={(text) => updateFormData('titulo', text)}
              placeholder="Ej. Desarrollador Frontend React"
            />
            {errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}
          </View>

          {/* Categoría y Tipo */}
          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.label}>Categoría *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.categoria && styles.inputError]}
                onPress={() => setShowCategoriaModal(true)}
              >
                <Text style={[styles.selectText, !formData.categoria && styles.placeholderText]}>
                  {formData.categoria || 'Seleccione una opción'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.label}>Tipo de vacante *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.tipo && styles.inputError]}
                onPress={() => setShowTipoModal(true)}
              >
                <Text style={[styles.selectText, !formData.tipo && styles.placeholderText]}>
                  {formData.tipo || 'Seleccione una opción'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}
            </View>
          </View>

          {/* Carrera */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Carreras (máximo 5)</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCarreraModal(true)}
            >
              <Text style={styles.placeholderText}>Buscar carrera...</Text>
              <ChevronDown size={20} color="#6b7280" />
            </TouchableOpacity>
            
            {carrerasSeleccionadas.length > 0 && (
              <View style={styles.tagsContainer}>
                {carrerasSeleccionadas.map(carrera => (
                  <View key={carrera} style={styles.tag}>
                    <Text style={styles.tagText}>{carrera}</Text>
                    <TouchableOpacity onPress={() => removeCarrera(carrera)}>
                      <X size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Ciudad y Modalidad */}
          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.label}>Ciudad *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.ciudad && styles.inputError]}
                onPress={() => setShowCiudadModal(true)}
              >
                <Text style={[styles.selectText, !formData.ciudad && styles.placeholderText]}>
                  {formData.ciudad || 'Seleccione una ciudad'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.ciudad && <Text style={styles.errorText}>{errors.ciudad}</Text>}
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.label}>Modalidad *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.modalidades && styles.inputError]}
                onPress={() => setShowModalidadModal(true)}
              >
                <Text style={styles.placeholderText}>Seleccione modalidad</Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.modalidades && <Text style={styles.errorText}>{errors.modalidades}</Text>}
              
              {modalidadesSeleccionadas.length > 0 && (
                <View style={styles.tagsContainer}>
                  {modalidadesSeleccionadas.map(modalidad => (
                    <View key={modalidad} style={styles.tag}>
                      <Text style={styles.tagText}>{getModalidadLabel(modalidad)}</Text>
                      <TouchableOpacity onPress={() => removeModalidad(modalidad)}>
                        <X size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción detallada de la vacante *</Text>
            <TextInput
              style={[styles.textArea, errors.descripcion && styles.inputError]}
              value={formData.descripcion}
              onChangeText={(text) => updateFormData('descripcion', text)}
              placeholder="Escriba la descripción de la vacante..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={styles.wordCountContainer}>
              <Text style={[styles.wordCount, wordCount > 500 && styles.wordCountError]}>
                Palabras: {wordCount}/500
              </Text>
            </View>
            {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
          </View>

          {/* Cantidad y Días de cierre */}
          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.label}>Cantidad a reclutar</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowCantidadModal(true)}
              >
                <Text style={[styles.selectText, !formData.cantidad && styles.placeholderText]}>
                  {formData.cantidad ? CANTIDADES.find(c => c.key === formData.cantidad)?.label : 'Seleccione cantidad'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.label}>Días de cierre *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.diasCierre && styles.inputError]}
                onPress={() => setShowDiasCierreModal(true)}
              >
                <Text style={[styles.selectText, !formData.diasCierre && styles.placeholderText]}>
                  {formData.diasCierre ? `${formData.diasCierre} días` : 'Seleccione días'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.diasCierre && <Text style={styles.errorText}>{errors.diasCierre}</Text>}
              
              {fechaExpiracion && (
                <View style={styles.fechaContainer}>
                  <Calendar size={16} color="#2563eb" />
                  <Text style={styles.fechaText}>Fecha de expiración: {fechaExpiracion}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Remuneración */}
        {showRemuneracion && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Remuneración</Text>
            
            {/* Tipo de pago y Moneda */}
            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.label}>Mostrar pago por</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    Alert.alert(
                      'Tipo de Pago',
                      'Seleccione el tipo de pago',
                      [
                        { text: 'Rango', onPress: () => updateFormData('tipoPago', 'rango') },
                        { text: 'Fijo', onPress: () => updateFormData('tipoPago', 'fijo') },
                        { text: 'Cancelar', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Text style={styles.selectText}>
                    {formData.tipoPago === 'rango' ? 'Rango' : 'Fijo'}
                  </Text>
                  <ChevronDown size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.formColumn}>
                <Text style={styles.label}>Moneda *</Text>
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectText}>($) - MXN</Text>
                  <DollarSign size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Salarios */}
            {formData.tipoPago === 'rango' ? (
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Mínimo *</Text>
                  <TextInput
                    style={[styles.input, errors.salarioMinimo && styles.inputError]}
                    value={formData.salarioMinimo}
                    onChangeText={(text) => updateFormData('salarioMinimo', text)}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                  {errors.salarioMinimo && <Text style={styles.errorText}>{errors.salarioMinimo}</Text>}
                </View>

                <View style={styles.formColumn}>
                  <Text style={styles.label}>Máximo *</Text>
                  <TextInput
                    style={[styles.input, errors.salarioMaximo && styles.inputError]}
                    value={formData.salarioMaximo}
                    onChangeText={(text) => updateFormData('salarioMaximo', text)}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                  {errors.salarioMaximo && <Text style={styles.errorText}>{errors.salarioMaximo}</Text>}
                </View>
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Salario fijo *</Text>
                <TextInput
                  style={[styles.input, errors.salarioFijo && styles.inputError]}
                  value={formData.salarioFijo}
                  onChangeText={(text) => updateFormData('salarioFijo', text)}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
                {errors.salarioFijo && <Text style={styles.errorText}>{errors.salarioFijo}</Text>}
              </View>
            )}

            {/* Tarifa */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tarifa *</Text>
              <TouchableOpacity
                style={[styles.selectButton, errors.tipoTarifa && styles.inputError]}
                onPress={() => setShowTipoTarifaModal(true)}
              >
                <Text style={styles.selectText}>Por Mes</Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
              {errors.tipoTarifa && <Text style={styles.errorText}>{errors.tipoTarifa}</Text>}
            </View>
          </View>
        )}

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Publicar vacante</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <SelectModal
        visible={showCategoriaModal}
        title="Seleccionar Categoría"
        data={CATEGORIAS}
        onSelect={(item) => {
          updateFormData('categoria', item);
          setShowCategoriaModal(false);
        }}
        onClose={() => setShowCategoriaModal(false)}
      />

      <SelectModal
        visible={showTipoModal}
        title="Seleccionar Tipo"
        data={TIPOS_VACANTE}
        onSelect={(item) => {
          updateFormData('tipo', item);
          setShowTipoModal(false);
        }}
        onClose={() => setShowTipoModal(false)}
      />

      <CarreraModal />

      <SelectModal
        visible={showModalidadModal}
        title="Seleccionar Modalidad"
        data={MODALIDADES}
        onSelect={addModalidad}
        onClose={() => setShowModalidadModal(false)}
        keyField="key"
        labelField="label"
      />

      <SelectModal
        visible={showCiudadModal}
        title="Seleccionar Ciudad"
        data={CIUDADES}
        onSelect={(item) => {
          updateFormData('ciudad', item);
          setShowCiudadModal(false);
        }}
        onClose={() => setShowCiudadModal(false)}
      />

      <SelectModal
        visible={showCantidadModal}
        title="Seleccionar Cantidad"
        data={CANTIDADES}
        onSelect={(item) => {
          updateFormData('cantidad', item.key);
          setShowCantidadModal(false);
        }}
        onClose={() => setShowCantidadModal(false)}
        keyField="key"
        labelField="label"
      />

      <SelectModal
        visible={showDiasCierreModal}
        title="Seleccionar Días de Cierre"
        data={DIAS_CIERRE}
        onSelect={(item) => {
          updateFormData('diasCierre', item.key);
          setShowDiasCierreModal(false);
        }}
        onClose={() => setShowDiasCierreModal(false)}
        keyField="key"
        labelField="label"
      />

      <SelectModal
        visible={showTipoTarifaModal}
        title="Seleccionar Tipo de Tarifa"
        data={[{ key: 'mes', label: 'Por Mes' }]}
        onSelect={(item) => {
          updateFormData('tipoTarifa', item.key);
          setShowTipoTarifaModal(false);
        }}
        onClose={() => setShowTipoTarifaModal(false)}
        keyField="key"
        labelField="label"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e7ff',
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  formColumn: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    color: '#374151',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    color: '#374151',
    height: 120,
    textAlignVertical: 'top',
  },
  selectButton: {
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: '#374151',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  wordCountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  wordCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  wordCountError: {
    color: '#dc2626',
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  fechaText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
});