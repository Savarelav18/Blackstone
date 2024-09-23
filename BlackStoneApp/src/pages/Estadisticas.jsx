import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts';
import { Typography, CircularProgress, Paper, Button } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function EstadisticasChart() {
    const [estadisticas, setEstadisticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/pacientes/api/v1/paciente/estadisticas/');
                setEstadisticas(response.data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(estadisticas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estadísticas");
        XLSX.writeFile(workbook, "estadisticas_atencion.xlsx");
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error al cargar las estadísticas: {error.message}</Typography>;
    }

    const nombres = estadisticas.map(item => item.nombre);
    const totalPacientes = estadisticas.map(item => item.total_pacientes);
    const promedioAtencion = estadisticas.map(item => item.promedio_atencion !== null ? item.promedio_atencion : 0);

    return (
        <Paper style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Estadísticas de Atención por Agente
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToExcel}>
                Exportar a Excel
            </Button>
            <BarChart
                series={[
                    { name: 'Total de Pacientes Atendidos', data: totalPacientes, label:"Total de Pacientes Atendidos"},
                    { name: 'Promedio de Atención (días)', data: promedioAtencion, label:"Promedio de Atención (días)"},
                ]}
                height={800}
                width={1000}
                xAxis={[{ data: nombres, scaleType: 'band' }]}
                margin={{ top: 100, bottom: 30, left: 40, right: 10 }}
            />
        </Paper>
    );
}
