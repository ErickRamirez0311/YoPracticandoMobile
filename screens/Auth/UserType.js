import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Briefcase, GraduationCap } from 'lucide-react-native';
import { useTheme } from "../../../web/DevOp/context/ThemeContext";
import { createUserTypeStyles } from '../Auth/userType/';

export default function UserType({ navigation }) {
    const { colors } = useTheme();
    const styles = createUserTypeStyles(colors);

    const handleSelect = (tipo) => {
        navigation.navigate('Register', { tipoUsuario: tipo });
    };

    return (
        <SafeAreaView>
            <TouchableOpacity
            style={styles-backButton}
            onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.inner}>
                <Text style={styles.title}>¿Que tipo de usuario eres?</Text>
                
                <TouchableOpacity style={styles.card} onPress={() => handleSelect('alumno')}>
                    <GraduationCap size={32} color={colors.primary} style={styles.icon} />
                    <Text style={styles.cardText}>Soy Alumno</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles-card} onPress={() => handleSelect('alumno')}>
                    <Briefcase size={32} color={colors.primary} style={styles.icon} />
                    <Text style={styles.cardText}>Soy Empresa</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}