import React, {useState, useEffect, use} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
    Camera,
    FileText,
    User,
    Mail,
    Phone,
    Globe,
    FileCheck,
    Upload,
    GraduationCap,
    x
} from 'lucide-react-native';
import { text } from "express";

export default function InfoBasica() {
    const [image, setImage] = useState(null);
    const [cv, setCV] = useState(null);
    const [perfilId, setPerfilId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        phonePrefix: '+52',
        phone: '',
        universidad: '',
        carrera: '',
        descripcion: '',
    });

    //Opciones de universidades

    const universidades = {
        'UNISON': 'Universidad de Sonora (UNISON)',
    'ITH': 'Instituto Tecnológico de Hermosillo (ITH)',
    'UTH': 'Universidad Tecnológica de Hermosillo (UTH)',
    'UVM': 'Universidad del Valle de México (UVM)',
    'TecMilenio': 'TecMilenio',
    'UDS': 'Universidad Durango Santander (UDS)',
    'ITESM': 'Tecnológico de Monterrey (ITESM)',
    'Vizcaya': 'Universidad Vizcaya de las Américas',
    'CEUNO': 'CEUNO Universidad',
    'UNIDEP': 'UNIDEP',
    'UES': 'Universidad Estatal de Sonora (UES)',
    'UNILIDER': 'UNILIDER',
    'UNID': 'UNID',
    };

    //Carreras por universidad
    const carrerasPorUniversidad = {
        'UNISON': ['Arquitectura', 'Ing. Agrónomo', 'Ing. Biomédica', 'Ing. Civil', 'Ing. en Ciencias Ambientales', 'Ing. en Energías Renovables', 'Ing. en Materiales', 'Ing. en Semiconductores', 'Ing. en Sistemas de Información', 'Ing. en Tecnología Electrónica', 'Ing. Industrial y de Sistemas', 'Ing. Mecatrónica', 'Ing. Metalúrgica', 'Ing. Minero', 'Ing. Químico', 'Lic. de Químico en Alimentos', 'Lic. en Administración', 'Lic. en Administración Pública', 'Lic. en Antropología', 'Lic. en Artes Escénicas', 'Lic. en Artes Plásticas', 'Lic. en Biología', 'Lic. en Ciencias de la Computación', 'Lic. en Ciencias de la Comunicación', 'Lic. en Ciencias Genómicas', 'Lic. en Ciencias Nutricionales', 'Lic. en Contaduría Pública', 'Lic. en Cultura Física y Deporte', 'Lic. en Derecho', 'Lic. en Diseño Gráfico', 'Lic. en Economía', 'Lic. en Educación', 'Lic. en Enfermería', 'Lic. en Enseñanza del Inglés', 'Lic. en Finanzas', 'Lic. en Física', 'Lic. en Física Medica', 'Lic. en Fisioterapia', 'Lic. en Geología', 'Lic. en Historia', 'Lic. en Lingüística', 'Lic. en Literaturas Hispánicas', 'Lic. en Logística', 'Lic. en Matemáticas', 'Lic. en Mercadotecnia', 'Lic. en Música', 'Lic. en Negocios y Comercio Internacionales', 'Lic. en Odontología', 'Lic. en Psicología', 'Lic. en Química', 'Lic. en Seguridad Pública', 'Lic. en Sociología', 'Lic. en Sustentabilidad', 'Lic. en Trabajo Social', 'Lic. en Turismo', 'Medicina', 'Médico Veterinario Zootecnista', 'Químico Biólogo Clínico'],
    'ITH': ['Ing. Biomédica', 'Ing. Eléctrica', 'Ing. Electrónica', 'Ing. Industrial', 'Ing. Mecatrónica', 'Ing. Mecánica', 'Ing. Gestión Empresarial', 'Administración', 'Sistemas Computacionales', 'Informática', 'Aeronáutica'],
    'UTH': ['Civil', 'Negocios y Mercadotecnia', 'Mantenimiento Industrial', 'Mecánica', 'Mecatrónica', 'Industrial', 'Tecnologías de la información e innovación digital', 'Aeronáutica en manufactura', 'Energía y desarrollo sostenible', 'Gastronomía', 'Protección Civil'],
    'UVM': ['Civil', 'Electrónica', 'Innovación', 'Matemáticas', 'Sistemas Computacionales', 'Industrial y de Sistemas', 'Mecánica Industrial', 'Mecatrónica', 'Mecatrónica con Enfoque Automotriz', 'Biotecnología', 'Cirujano Dentista', 'Enfermería', 'Fisioterapia', 'Medicina', 'Medicina Veterinaria y Zootecnia', 'Nutrición', 'Psicología', 'Químico Farmacéutico Biotecnólogo', 'Comunicación y Medios Digitales', 'Derecho', 'Educación', 'Lenguas Extranjeras', 'Arquitectura', 'Diseño de la Moda e Industria del Vestido (NABA)', 'Diseño Industrial', 'Diseño Multimedia', 'Diseño y Comunicación Gráfica', 'Administración Turística y Hotelera', 'Gastronomía Internacional', 'Administración de Empresas', 'Administración de Negocios Internacionales', 'Comercio y Logística Internacionales', 'Contaduría Pública y Finanzas', 'Mercadotecnia', 'Mercadotecnia y Publicidad en Entornos Digitales'],
    'TecMilenio': ['Logística y cadena de suministro', 'Derecho', 'Mecatrónica', 'Industrial', 'Mercadotecnia', 'Creación y desarrollo de empresas', 'Comercio y negocios internacionales', 'Contabilidad y estrategia financiera', 'Administración de empresas', 'Desarrollo de software', 'Gastronomía internacional', 'Diseño gráfico y animación', 'Psicología'],
    'UDS': ['Gastronomía', 'Criminología', 'Derecho', 'Ciencias políticas', 'Administración pública', 'Psicopedagogía', 'Mercadotecnia', 'Contaduría Pública', 'Arquitectura', 'Optometría', 'Diseño de modas', 'Ciencias y técnicas de la comunicación', 'Comercio exterior y aduanas', 'Relaciones internacionales', 'Logística de negocios', 'Odontología', 'Fisioterapia', 'Nutrición', 'Medicina general', 'Enfermería', 'Cosmetología'],
    'ITESM': ['Arquitectura', 'Industrial y de Sistemas', 'Mecatrónica', 'Tecnologías Computacionales', 'Innovación y Desarrollo', 'Estrategia y Transformación de Negocios', 'Finanzas', 'Diseño', 'Mercadotecnia', 'Negocios Internacionales'],
    'Vizcaya': ['Lic. en Admin. de Empresas', 'Lic. en Arquitectura', 'Lic. en Ciencias de la Educación', 'Lic. en Comercio Internacional y Aduanas', 'Lic. en Contaduría Pública', 'Lic. en Criminología', 'Lic. en Derecho', 'Lic. en Enfermería', 'Lic. en Fisioterapia', 'Lic. en Gastronomía', 'Lic. en Nutrición', 'Lic. en Odontología', 'Lic. en Psicología'],
    'CEUNO': ['Gastronomía', 'Industrial y de Sistemas', 'Psicología Organizacional', 'Energías Renovables', 'Derecho', 'Ciencias de la Educación', 'Comercio Internacional', 'Mercadotecnia', 'Administración y Gestión empresarial', 'Comunicación y Medios Digitales', 'Criminología', 'Psicología General y Aplicada', 'Contabilidad', 'Pedagogía', 'Desarrollo de Software'],
    'UNIDEP': ['Administración de Empresas', 'Administración de Empresas Turísticas', 'Administración de Tecnologías de la Información', 'Ciencias de la Comunicación', 'Comercio Internacional', 'Contaduría Pública', 'Mercadotecnia', 'Derecho', 'Pedagogía', 'Arquitectura', 'Diseño Gráfico', 'Industrial y de Sistemas', 'Sistemas Computacionales', 'Manufactura y Robótica'],
    'UES': ['Tecnología de alimentos', 'Software', 'Mecatrónica', 'Industrial en manufactura', 'Horticultura', 'Geociencias', 'Biotecnología Acuática', 'Biomédica', 'Ambiental', 'Administración De Empresas', 'Administración De Empresas Turísticas', 'Agro Negocio', 'Comercio Internacional', 'Contaduría', 'Criminología', 'Ecología', 'Enfermería', 'Entrenamiento Deportivo', 'Finanzas E Inversiones', 'Fisioterapia', 'Gestión Y Desarrollo De Negocios', 'Medicina General', 'Nutrición Humana'],
    'UNILIDER': ['Administración de Empresas', 'Ciencias de la Educación', 'Contaduría y Finanzas', 'Derecho', 'Industrial', 'Negocios Internacionales', 'Psicología'],
    'UNID': ['Industrial y Calidad', 'Software y Sistemas Computacionales', 'Administración Empresarial', 'Contabilidad y Finanzas', 'Derecho y Ciencias Jurídicas', 'Mercadotecnia Estratégica', 'Administración de Empresas', 'Contabilidad Financiera', 'Derecho', 'Industrial y Logística', 'Ejecutiva en Mercadotecnia']
    };

    //Opciones de idiomas
    const OpcionesIdiomas = [
        { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' },
    { value: 'pt', label: 'Portugués' },
    ];

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    //Funcion para limpiar HTML tags
    const cleanHtmlText = (html) => {
        if (!html) return '';
        //Remover tags HTML basicos
        let text = html.replace(/<[^>]*>?/gm, '');
        //Decodificar entidades HTML comunes
        text = text.replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
        //Limpiar espacios extra y saltos de linea
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    };

    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem('userId');
            if (!id) {
                Alert.alert('Error', 'No se encontro el ID del usuario.');
                setLoading(false);
                return;
            }
            setUserId(id);
            await fetchPerfil(id);
        })();
    }, []);

    const fetchPerfil = async id => {
        try {
            const res = await fetch(``);
            const data = await res.json();

            if (data.success && data.informacion_basica) {
                const info = data.informacion_basica;
                setPerfilId(info.id);
                setForm({
                    nombre: info.nombre ?? '',
                    apellido: info.apellido ?? '',
                    email: info.email ?? '',
                    phonePrefix: info.codigo_pais ?? '+52',
                    phone: info.telefono ?? '',
                    universidad: info.universidad ?? '',
                    carrera: info.carrera ?? '',
                    descripcion: cleanHtmlText(info.descripcion ?? ''),
                });

                //Cargar idiomas seleccionados
                if (info.idiomas) {
                    const idiomas = info.idiomas.split(',').map(idioma.trim()).filter(idioma => idioma);
                    setIdiomasSeleccionados(idiomas);
                }

                if (info.foto) setImage(``);
                if (info.cv) setCV({});
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo cargar tu informacion.');
        } finally {
            setLoading(false);
        }
    };

    const agregarIdioma = (idioma) => {
        if (!idioma || idiomasSeleccionados.includes(idioma)) return;
        setIdiomasSeleccionados([...idiomasSeleccionados, idioma]);
        setIdiomaSeleccionado('');
    };

    const eliminarIdioma = (idioma) => {
        setIdiomasSeleccionados(idiomasSeleccionados.filter(item => item !== idioma));
    };

    const getIdiomaLabel = (value) => {
        const idioma = OpcionesIdiomas.find(opt.value === value);
        return idioma ? idioma.label : value;
    };

    const handleGuardar = async () => {
        if (!userId) {
            Alert.alert('Error', 'Falta el ID del usuario.');
            return;
        }

        //Validaciones basicas
        if (!form.nombre.trim() || !form.apellido.trim()) {
            Alert.alert('Error', 'El nombre y apellido son obligatorios.');
            return;
        }

        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
            Alert.alert('Error', 'Ingresar un email valido.');
        }

        setSaving(true);

        const fd = new FormData();
        fd.append('usuario_id', userId);
        if (perfilId) fd.append('perfil_id', perfilId);
        fd.append('nombre', form.nombre);
        fd.append('apellido', form.apellido);
        fd.append('email', form.email);
        fd.append('codigo_pais', form.codigo_pais);
        fd.append('telefono', form.phone);
        fd.append('universidad', form.universidad);
        fd.append('carrera', form.carrera);
        fd.append('idiomas', idiomasSeleccionados.join(','));
        fd.append('descripcion', form.descripcion);

        if (image && !image.startsWith('http')) {
            fd.append('foto', { uri:image, name: 'foto.jpg', type: 'image/jpeg' });
        }
        if (cv && !cv.uri.startsWith('http')) {
            fd.append('cv', { uri:cv.uri, name: cv.name ?? 'cv.pdf', type:cv.mimeType ?? 'application/pdf' });
        }

        try {
            const res = await fetch(``, {
                method: 'POST',
                headers: {},
                body: fd, 
            });
            const json = await res.json();

            if (json.success) {
                if (json.perfilId) setPerfilId(json.perfilId);
                Alert.alert('Exito', json.message || 'Informacion guardada correctamente')
            } else {
                Alert.alert('Error', json.message ?? 'No se pudo guardar.');
            }
        } catch (err) {
            console.error('Network error:', err);
            Alert.alert('Error', 'No se pudo conectar con el servidor.');
        } finally {
            setSaving(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se requieren permisos de galeria.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if  (!result.cancelled && result.assets && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: [
                'application/pdf',
                'application/msword',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        });
        if (!result.cancelled && result.assets && result.assets[0]) {
            setCV(result.assets[0]);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={StyleSheet.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text style={styles.loadingText}>Cargando informacion...</Text>
            </SafeAreaView>
        );
    }

    const carrerasDisponibles = form.universidad ? carrerasPorUniversidad[form.universidad] || [] : [];
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f7ff"/>

            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
            >
                <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.subtitle}>
                        Completa tu perfil para que las empresas te conozcan mejor
                    </Text>

                    {/* Photo Section */}
                    <View style={styles.photoSection}>
                        <Text style={styles.sectionTitle}>Foto de perfil</Text>
                        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                            {image ? (
                                <Image source={{uri: image }} style={styles.profileImage}/>
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <Camera size={32} color = "#9ca3af"/>
                                    <Text style={styles.photoPlaceholderText}>Agregar foto</Text>
                                </View>
                            )}
                            <View style={styles-photoOverlay}>
                               <Camera size={20} color="#ffffff"/> 
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Personal Info */}
                    <View style={styles.section}>
                        <View style={styles.input}>
                            <User size={20} color="#2563eb" />
                            <Text style={styles.sectionTitle}>Informacion Personal</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Tu nombre"
                                value={form.nombre}
                                onChangeText={text => handleChange('nombre', text)}
                                placeholderTextColor="#9ca3af"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Apellido *</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Tu apellido"
                                value={form.apellido}
                                onChangeText={text => handleChange('apellido', text)}
                                placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Mail size={20} color="#2563eb"/>
                            <Text style={styles.sectionTitle}>Informacion de Contacto</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo electronico *</Text>
                            <TextInput
                            style={styles.input}
                            placeholder="ejemplo@correo.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={text => handleChange('email', text)}
                            placeholderTextColor="#9ca3af"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Telefono</Text>
                            <View style={styles.phoneContainer}>
                                <TextInput
                                style={[styles.input, styles.phonePrefix]}
                                placeholder="+52"
                                value={form.phonePrefix}
                                onChangeText={text => handleChange('phonePrefix', text)}
                                placeholderTextColor="#9ca3af"
                                />
                                <TextInput
                                style={[styles.input, styles.phoneNumber]}
                                placeholder="Número de teléfono"
                                keyboardType="phone-pad"
                                value={form.phone}
                                onChangeText={text => handleChange('phone', text)}
                                maxLength={10}
                                placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Education Info */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <GraduationCap size={20} color="#2563eb" />
                            <Text style={styles.sectionTitle}>Infomacion Academica</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Universidad</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                selectedValue={form.universidad}
                                onValueChange={(value) => {
                                    handleChange('universidad', value);
                                    //Limpiar carrera cuando cambia la universidad
                                    if (form.carrera && (!carrerasPorUniversidad[value] || !carrerasPorUniversidad[value].includes(form.carrera))) {
                                        handleChange('carrera', '');
                                    }
                                }}
                                style={styles.picker}
                                >
                                    <Picker.Item label="Selecciona una universidad" value=""/>
                                    {Object.entries(universidades).map(([id, nombre]) => (
                                        <Picker.Item key={id} label={nombre} value={id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Carrera</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                selectedValue={form.carrera}
                                onValueChange={(value) => handleChange('carrera', value)}
                                style={styles.picker}
                                enabled={carrerasDisponibles.length > 0}
                                >
                                    <Picker.Item 
                                    label={carrerasDisponibles.length > 0 ? "Selecciona una carrera" : "Selecciona universidad primero"}
                                    value=""
                                    />
                                    {carrerasDisponibles.map((carrera, index) => (
                                        <Picker.Item key={index} label={carrera} value={carrera}/>
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Language Info */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Globe size={20} color="#2563eb" />
                            <Text style={styles.sectionTitle}>Idiomas</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Seleccionar idiomas</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                selectedValue={idiomaSeleccionado}
                                onValueChange={(value) => {
                                    setIdiomaSeleccionado(value);
                                    agregarIdioma(value);
                                }}
                                style={styles.picker}
                                >
                                    <Picker.Item label="Selecciona un idioma" value="" />
                                    {opcionesIdiomas.map((idioma) => (
                                        <Picker.Item
                                        key={idioma.value} 
                                        label={idioma.label} 
                                        value={idioma.value}
                                        enabled={!idiomasSeleccionados.includes(idioma.value)}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.tagsContainer}>
                            {idiomasSeleccionados.map((idioma, index) => (
                                <TouchableOpacity
                                key={index}
                                style={styles.languageTag}
                                onPress={() => eliminarIdioma(idioma)}
                                >
                                    <Text style={styles.languageTagText}>{getIdiomaLabel(idioma)}</Text>
                                    <X size={16} color="#2563eb" />
                                </TouchableOpacity>
                            ))}
                            {idiomasSeleccionados.length === 0 && (
                                <Text style={styles.emptyText}>No has seleccionado idiomas</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Descripcion personal</Text>
                            <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Cuentanos sobre ti, tus intereses y objetivos profesionales..."
                            multiline
                            numberOfLines={4}
                            value={form.descripcion}
                            onChangeText={text => {
                                //Contar caracteres para validar limite
                                const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
                                if (wordCount <= 200) {
                                    handleChange('descripcion', text);
                                }
                            }}
                            textAlignVertical="top"
                            placeholderTextColor="#9ca3af"
                            maxLength={999} //Limite de caracteres como respaldo
                            />
                            <Text style={styles.characterCount}>
                                {form.descripcion.trim() ? form.descripcion.trim().split(/\s+/).length : 0}/200 palabras
                            </Text>
                        </View>
                    </View>

                    {/* CV Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <FileText size={20} color="#2563eb" />
                            <Text style={styles.sectionTitle}>Curriculum Vitae</Text>
                        </View>

                        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                            <View style={styles.uploadContent}>
                                {cv ? (
                                    <>
                                    <FileCheck size={24} color="#10b981"/>
                                    <View style={styles.uploadTextContainer}>
                                        <Text style={styles.uploadTitle}>CV Seleccionado</Text>
                                        <Text style={styles.uploadSubtitle}>{cv.name}</Text>
                                    </View>
                                    </>
                                ) : (
                                    <>
                                    <Upload size={24} color="#6b7280" />
                                    <View style={styles.uploadTextContainer}>
                                        <Text style={styles.uploadTitle}>Seleccionar CV</Text>
                                        <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX</Text>
                                    </View>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleGuardar}
                    disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                {perfilId ? 'Actualizar Informacion' : 'Guardar Informacion'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    position: 'relative',
    marginTop: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
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
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  phonePrefix: {
    flex: 0.3,
  },
  phoneNumber: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 40,
    marginTop: 8,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  languageTagText: {
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
  characterCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadTextContainer: {
    marginLeft: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
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