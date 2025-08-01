import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import e from "express";

export default function ConfiguracionEmpresa({ navegation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [ubicacion, setUbicacion] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const usuario_id = await AsyncStorage.getItem('userId');
            const params = new URLSearchParams();
            params.append('usuario_id', usuario_id);
            params.append('accion', 'obtenerDatos');

            const response = await axios.post(

                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.success) {
                const e = response.data.empresa;
                setNombre(e.nombre_empresa);
                setEmail(e.email);
                setUbicacion(e.ubicacion);
            } else {
                Alert.alert('Error', 'No se pudieron obtener los datos');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrio un error al obtener la inforacion');
        }
    };

    const guardarCambios = async () => {
        try {
            setLoading(true);
            const usuario_id = await AsyncStorage.getItem('userId');

            const form = new URLSearchParams();
            form.append('usuario_id', usuario_id);
            form.append('accion', 'actualizarDatos');
            form.append('nombre_empresa', nombre);
            form.append('email', email);
            form.append('ubicacion', ubicacion);

            const response = await axios.post(

                form.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.success) {
                Alert.alert('Exito', 'Datos actualizados correctamente');
            } else {
                Alert.alert('Exito', response.data.message || 'No se pudieron guardar los cambios');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrio un error al guardar los datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Configuracion de la Empresa</Text>

                <Text style={styles.label}>Nombre de la empresa</Text>
                <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
                />

                <Text style={styles.label}>Correo electronico</Text>
                <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                />

                <Text style={styles.label}>Ubicacion</Text>
                <TextInput
                style={styles.input}
                value={ubicacion}
                onChangeText={setUbicacion}
                placeholder="Ubicacion"
                />

                <TouchableOpacity
                style={styles.button}
                onPress={guardarCambios}
                disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Guardado' : 'Guardar Cambios'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7ff'
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#111827',
   },
   label: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
   },
   input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
   },
   button: {
    backgroundColor: '#007AFF',
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
   },
   buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
   },
});