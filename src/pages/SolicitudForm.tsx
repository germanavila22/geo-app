import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { SolicitudPDF } from '../components/SolicitudPDF';

// Definición de Tipos
interface FormData {
    nombreCompleto: string;
    nombreEmpresa: string;
    fechaSolicitud: string;
    tiposAnalisis: string[];
    muestras: string; // Muestras separadas por coma
}

const analisisOpciones = [
    'Químico',
    'Bacteriológico',
    'Microbiológico',
    'Físico-químico',
];

const SolicitudForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        nombreCompleto: '',
        nombreEmpresa: '',
        fechaSolicitud: new Date().toISOString().substring(0, 10), // Fecha actual por defecto
        tiposAnalisis: [],
        muestras: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // Manejadores de estado
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateForm();
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newAnalisis = checked
                ? [...prev.tiposAnalisis, value]
                : prev.tiposAnalisis.filter(a => a !== value);
            return { ...prev, tiposAnalisis: newAnalisis };
        });
        validateForm();
    };

    // Lógica de Validación básica (puedes expandirla con librerías como Zod/Formik)
    const validateForm = () => {
        const isValid = formData.nombreCompleto.trim() !== '' &&
                        formData.nombreEmpresa.trim() !== '' &&
                        formData.fechaSolicitud.trim() !== '' &&
                        formData.tiposAnalisis.length > 0 &&
                        formData.muestras.trim() !== '';
        setIsFormValid(isValid);
    };

    // Preparación de datos para el PDF
    const samplesList = formData.muestras
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
    
    // Nombre del archivo PDF
    const pdfFileName = `Solicitud_${formData.nombreEmpresa.replace(/\s/g, '_')}_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                Laboratorio - Solicitud de Análisis
            </h1>

            <form className="space-y-6">
                {/* Campos de Información General */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                        <input
                            type="text"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa *</label>
                        <input
                            type="text"
                            name="nombreEmpresa"
                            value={formData.nombreEmpresa}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Solicitud *</label>
                    <input
                        type="date"
                        name="fechaSolicitud"
                        value={formData.fechaSolicitud}
                        onChange={handleChange}
                        className="mt-1 block w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        required
                    />
                </div>

                {/* Selección de Tipo de Análisis */}
                <fieldset>
                    <legend className="text-base font-medium text-gray-900 border-b pb-1">Tipo de Análisis *</legend>
                    <div className="mt-4 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {analisisOpciones.map((opcion) => (
                            <div key={opcion} className="flex items-center">
                                <input
                                    id={opcion}
                                    name="tiposAnalisis"
                                    type="checkbox"
                                    value={opcion}
                                    checked={formData.tiposAnalisis.includes(opcion)}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={opcion} className="ml-3 text-sm font-medium text-gray-700">
                                    {opcion}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Campo de Muestras */}
                <div>
                    <label htmlFor="muestras" className="block text-sm font-medium text-gray-700">
                        Muestras a Analizar (Separadas por coma) *
                    </label>
                    <textarea
                        id="muestras"
                        name="muestras"
                        rows={3}
                        value={formData.muestras}
                        onChange={handleChange}
                        placeholder="Ejemplo: Muestra A-123, Muestra B-456, Muestra C-789"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        required
                    />
                </div>
            </form>

            {/* Botón de Generación de PDF */}
            <div className="mt-8 pt-4 border-t">
                {isFormValid ? (
                    <PDFDownloadLink
                        document={
                            <SolicitudPDF
                                data={{ ...formData, muestrasList: samplesList }}
                            />
                        }
                        fileName={pdfFileName}
                    >
                        {({ loading }) => (
                            <button
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={loading}
                            >
                                {loading ? 'Generando Documento...' : 'Generar e Imprimir/Guardar PDF'}
                            </button>
                        )}
                    </PDFDownloadLink>
                ) : (
                    <div className="w-full p-3 text-center bg-gray-200 text-gray-600 font-medium rounded-md">
                        Por favor, complete todos los campos obligatorios para generar el PDF.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitudForm