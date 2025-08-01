import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Alert,
    ActivityIndicator
} from 'react-native';
import {
    FileText,
    Settings,
    HelpCircle,
    LogOut,
    ChevronRight,
    Camera,
    User,
    GraduationCap,
    Brain,
    Medal,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";

export default function Perfil({ navigation }) {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    //Obtener datos cuando la pantalla esta enfocada
    useEffect(() => {
        if (isFocused) {
            obtenerDatosUsuario();
        }
    }, [isFocused]);

    //Funcion para obtener datos del usuario desde el servidor
    const obtenerDatosUsuario = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                Alert.alert('Error', 'No se encontro el ID de usuario');
                //Cargar datos por defecto si no hay userId
                setUserProfile({
                    nombre_usuario: 'Usuario',
                    email: 'usuario@correo.com',
                    tipo_usuario: 'alumno',
                });
                setLoading(false);
                return;
            }
            
            //Hacer peticion a la API
            const response = await axios.get(
                ``,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.success) {
            const usuario = response.data.usuario;
            setUserProfile(usuario);

            //Actualizar AsyncStorage con los datos mas recientes
            await AsyncStorage.setItem('userName', usuario.nombre_usuario || 'Usuario');
            await AsyncStorage.setItem('userEmail', usuario.email || '');
            await AsyncStorage.setItem('userType', usuario.tipo_usuario || 'alumno');
        } else {
            console.log('Error en respuesta:', response.data.message);
            //Si falla la peticion, cargar datos desde AsyncStorage como fallback
            await cargarDatosDesdeAsyncStorage();
        }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            //Si hay error de red, cargar datos desde AsyncStorage como fallback
            await cargarDatosDesdeAsyncStorage();
        } finally {
            setLoading(false);
        }
    };

    //Funcion fallback para cargar datos desde AsyncStorage
    const cargarDatosDesdeAsyncStorage = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const userName = await AsyncStorage.getItem('userName');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userType = await AsyncStorage.getItem('userType');

            setUserProfile({
                id: userId,
                nombre_usuario: userName || 'Usuario',
                email: userEmail || 'usuario@correo.com',
                tipo_usuario: userType || 'alumno',
                telefono: '',
                habilidades: '',
                verificado: 0,
            });
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
            setUserProfile({
                nombre_usuario: 'Usuario',
                email: 'usuario@correo.com',
                tipo_usuario: 'alumno',
            });
        }
    };

    //Funcion para refrescar datos
    const onRefresh = async () => {
        setRefreshing(true);
        await obtenerDatosUsuario();
        setRefreshing(false);
    };

    //Navigation handlers
    const handleMisSolicitudes = () => {
        navigation.navigate('MisSolicitudes');
    };

    const handleInformacionPersonal = () => {
        navigation.navigate('InfoBasica');
    };

    const handleEducacion = () => {
        navigation.navigate('Educacion');
    };

    const handleHabilidades = () => {
        navigation.navigate('Habilidades');
    };

    const handleReconocimientos = () => {
        navigation.navigate('Reconocimientos');
    };

    const handleConfiguracion = () => {
        navigation.navigate('Navegar a Configuracion');
    };

    const handleAyuda = () => {
        console.log('Navegar a Ayuda');
    };

    const handleCerrarSesion = async () => {
        Alert.alert(
            'Cerrar Sesion',
            '¿Estas seguro que quieres cerrar sesion?',
            [
                {text: 'Cancelar', style: 'cancel'},
                {
                    text: 'Cerrar Sesion',
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove([
                                'userId', 'userType', 'userName', 'userEmail', 'userToken'
                            ]);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }],
                            });
                        } catch (error) {
                            console.error('Error al cerrar sesion:', error);
                        }
                    }
                },
            ]
        );
    };

    const handleChangePhoto = () => {
        Alert.alert(
            'Cambiar foto',
            'Selecciona una opcion',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Camara', onPress: () => console.log('Abrir galeria') },
            ]
        );
    };

    //Get user initials for avatar
    const  getUserInitials = (nombre) => {
        if (!nombre) return 'U';
        return nombre
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando pefil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            <ScrollView
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            >
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {userProfile?.avatar ? (
                            <Image source={{uri: userProfile.avatar}} style={styles.avatar} />
                        ) : (
                            <View style ={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {getUserInitials(userProfile?.nombre_usuario)}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                            <Camera size={16} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{userProfile?.nombre_usuario || 'Usuario'}</Text>
                    <Text style={styles.userEmail}>{userProfile?.email || 'usuario@correo.com'}</Text>

                    {/* Mostrar informacion adicional si esta disponible */}
                    {userProfile?.telefono && (
                        <Text style={styles.userInfo}>
                            {userProfile.codigo_pais} {userProfile.telefono}
                        </Text>
                    )}

                    {userProfile?.habilidades && (
                        <Text style={styles.userInfo}>{userProfile.habilidades}</Text>
                    )}

                    {/* Indicador de verificacion */}
                    {userProfile?.verificado === 1 && (
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verfiedText}>✓ Verificado</Text>
                        </View>
                    )}
                </View>

                {/* Profile Sections - 4 cuadros rediseñados */}
                <View style={styles.sectionsContainer}>
                    <Text style={styles.sectionTitle}>Mi Perfil</Text>

                    <View style={styles.sectionsGrid}>
                        {/* Informacion Personal */}
                        <TouchableOpacity
                        style={styles.sectionCard}
                        onPress={handleInformacionPersonal}
                        >
                            <View style={[styles.sectionIcon, { backgroundColor:'#e0f2fe' }]}>
                                <User size={24} color="#0284c7"/>
                            </View>
                            <Text style={styles.sectionCardTitle}>Informacion Basica</Text>
                        </TouchableOpacity>

                        {/* Educacion */}
                        <TouchableOpacity
                        style={styles.sectionCard}
                        onPress={handleEducacion}
                        >
                            <View style={[styles.sectionIcon, { backgroundColor: '#f0f9ff' }]}>
                                <GraduationCap size={24} color="#0369a1" />
                            </View>
                            <Text style={styles.sectionCardTitle}>Educacion</Text>
                        </TouchableOpacity>

                        {/* Habilidades */}
                        <TouchableOpacity
                        style={styles.sectionCard}
                        onPress={handleHabilidades}
                        >
                            <View style={[styles.sectionIcon, { backgroundColor: '#f3e8ff' }]}>
                                <Brain size={24} color="#7c3aed" />
                            </View>
                            <Text style={styles.sectionCardTitle}>Habilidades</Text>
                        </TouchableOpacity>

                        {/* Reconocimientos */}
                        <TouchableOpacity
                        style={styles.sectionCard}
                        onPress={handleReconocimientos}
                        >
                            <View style={[styles.sectionIcon, {backgroundColor: '#fef3c7' }]}>
                                <Medal size={24} color="#d97706" />
                            </View>
                            <Text style={styles.sectionCardTitle}>Reconocimientos</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mis Solicitudes Section */}
                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Mis Aplicaciones</Text>

                    <TouchableOpacity
                    style={styles.actionCard}
                    onPress={handleMisSolicitudes}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
                            <FileText size={24} color="#dc2626"/>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Mis Solicitudes</Text>
                            <Text style={styles.actionSubtitle}>Ver estado de aplicaciones</Text>
                        </View>
                        <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Menu Options */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Configuracion</Text>

                    <View style={styles.menuList}>
                        <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleConfiguracion}
                        >

                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, { backgroundColor:'#f3f4f6' }]}>
                                    <Settings size={20} color="6b7280" />
                                </View>
                                <Text style={styles.menuItemText}>Configuracion</Text>
                            </View>
                            <ChevronRight size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleAyuda}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
                                    <HelpCircle size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.menuItemText}>Ayuda y Soporte</Text>
                            </View>
                            <ChevronRight size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleCerrarSesion}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
                                    <LogOut size={20} color="#dc2626" />
                                </View>
                                <Text style={[styles-menuItemText, styles.logoutText]}>Cerrar Sesion</Text>
                            </View>
                            <ChevronRight size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

})