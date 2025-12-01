import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Tipos para los datos del PDF
interface PDFData {
    nombreCompleto: string;
    nombreEmpresa: string;
    fechaSolicitud: string;
    tiposAnalisis: string[];
    muestras: string;
    muestrasList: string[]; // Lista de muestras ya separadas
}

// Estilos del PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontSize: 12,
    },
    header: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 15,
        borderBottom: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        marginBottom: 5,
    },
    dateGenerated: {
        fontSize: 10,
        textAlign: 'right',
        marginTop: 30,
    },
    // Estilos para la Segunda Página (Muestras)
    page2Title: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    muestrasListContainer: {
        marginTop: 10,
    },
    muestrasItem: {
        marginBottom: 4,
        padding: 3,
        borderBottom: 1,
        borderBottomColor: '#eeeeee',
    }
});

interface SolicitudPDFProps {
    data: PDFData;
}

export const SolicitudPDF: React.FC<SolicitudPDFProps> = ({ data }) => {
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Document>
            {/* --- Página 1: Datos de la Solicitud --- */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Solicitud de Análisis de Laboratorio</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Datos del Solicitante</Text>
                    <Text style={styles.value}>Nombre Completo: {data.nombreCompleto}</Text>
                    <Text style={styles.value}>Empresa: {data.nombreEmpresa}</Text>
                    <Text style={styles.value}>Fecha de Solicitud: {data.fechaSolicitud}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Tipos de Análisis Requeridos</Text>
                    <Text style={styles.value}>
                        {data.tiposAnalisis.join(', ')}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Muestras (Resumen)</Text>
                    <Text style={styles.value}>{data.muestras}</Text>
                </View>

                <Text style={styles.dateGenerated}>Generado el: {fechaGeneracion}</Text>
            </Page>

            {/* --- Página 2: Lista Detallada de Muestras --- */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.page2Title}>Detalle de Muestras a Analizar</Text>
                <View style={styles.muestrasListContainer}>
                    {data.muestrasList.map((muestra, index) => (
                        <Text key={index} style={styles.muestrasItem}>
                            {index + 1}. {muestra}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
};