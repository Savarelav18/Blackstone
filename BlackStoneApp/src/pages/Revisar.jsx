import {Box, Stack, Divider, Button, Checkbox, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography,List, ListItem, ListItemText, Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleIcon, XIcon } from '../components/Icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { actualizarEstadoFechaFin,actualizarEstadoFechaInicio, getPacientesAsignados } from '../api/empleados.api';
import { useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const Revisar = () => {
    const [pacientes, setPacientes] = useState([]);
    const { usuarioLogueado } = useAuth();
    const {handleSubmit, setValue, watch } = useForm();
    const [mensaje, setMensaje] = useState(null);
    const [open, setOpen] = useState(false);  // Estado para controlar la modal
    const [selectedPacienteInfo, setSelectedPacienteInfo] = useState(null);  // Estado para almacenar la info del paciente seleccionado
    const [ordenEstado, setOrdenEstado] = useState("");
    const [ordenEnviada, setOrdenEnviada] = useState(false); // Estado para indicar si la solicitud ha sido enviada
    const [ordenAtendida, setOrdenAtendida] = useState(false); // Estado para indicar si la solicitud ha sido atendida
    const [fechaSolicitudRevisada, setFechaSolicitudRevisada] = useState(null);
    const [fechaSolicitudEnviada, setFechaSolicitudEnviada] = useState(null);
    const [fechaSolicitudAtendida, setFechaSolicitudAtendida] = useState(null);
    const navigate = useNavigate();

    const extractFileName = (url) => {
        const urlObject = new URL(url);
        const path = urlObject.pathname;
        const fileName = path.split('/').pop();
        return fileName;
    };

    

    const selectedPatient = watch("selectedPatient") || [];

    const handleChangeSelection = (event) => {
        setOrdenEstado(event.target.value);
    };


    const renderTimelineItem = (text, completed) => (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2 }}>
            {completed ? <CheckCircleIcon /> : <XIcon />}
            <Typography variant="body1">{text}</Typography>
        </Stack>
    );

    useEffect(() => {
        async function loadEmpleado() {
            try {
                const res = await getPacientesAsignados(usuarioLogueado.id);
                setPacientes(res.data);
            } catch (error) {
                console.error("Error al cargar los pacientes:", error);
            }
        }

        if (usuarioLogueado) {
            loadEmpleado();
        }
    }, [usuarioLogueado]);

    const handleChange = (paciente) => {
        const isSelected = selectedPatient.some(p => p.id === paciente.id);
        const updatedSelection = isSelected 
            ? selectedPatient.filter(p => p.id !== paciente.id) 
            : [...selectedPatient, paciente];
        
        setValue("selectedPatient", updatedSelection);
    };

    const handleClickOpen = (paciente) => {
        const fechaActual = new Date().toLocaleDateString("es-ES");
        setSelectedPacienteInfo(paciente);
        setOrdenEnviada(paciente.estadoOrden === "Solicitud_Enviada");
        setOrdenAtendida(paciente.estadoOrden === "Atendida");
        setFechaSolicitudRevisada(fechaActual);
        setOpen(true);
        console.log(selectedPacienteInfo)
        
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = handleSubmit(async (data) => {
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString().split('.')[0]; // Formato ISO 8601 sin segundos
    
        let errorAlActualizar = false;
    
        // Recorrer todos los pacientes seleccionados
        for (let paciente of data.selectedPatient) {
            let res = null;
    
            // Actualizar el estado y las fechas para cada paciente según el estado de la orden
            if (ordenEstado === "Solicitud Enviada") {
                res = await actualizarEstadoFechaInicio(
                    paciente.id,                                // ID del paciente seleccionado
                    paciente.estadoOrden = ordenEstado,         // Estado de la orden actualizado
                    paciente.fecha_inicio_atencion = fechaFormateada // Fecha de inicio de atención
                );
            } else if (ordenEstado === "Atendida") {
                res = await actualizarEstadoFechaFin(
                    paciente.id,                                // ID del paciente seleccionado
                    paciente.estadoOrden = ordenEstado,         // Estado de la orden actualizado
                    paciente.fecha_fin_atencion = fechaFormateada  // Fecha de fin de atención
                );
            }
    
            // Si alguna actualización falla, mostrar un mensaje de error
            if (res.status !== 200 && res.status !== 201) {
                errorAlActualizar = true;
                break;
            }
        }
    
        // Mostrar el mensaje de éxito o error basado en los resultados
        if (errorAlActualizar) {
            setMensaje("Hubo un error al actualizar el estado de uno o más pacientes.");
        } else {
            setMensaje("Se actualizó correctamente el estado de la orden para todos los pacientes seleccionados.");
    
            // Actualizar el estado del componente
            if (ordenEstado === "Solicitud Enviada") {
                setOrdenEnviada(true);
                setOrdenAtendida(false);
            } else if (ordenEstado === "Atendida") {
                setOrdenEnviada(true);
                setOrdenAtendida(true);
            } else if (ordenEstado === "Sin_Iniciar") {
                setOrdenEnviada(false);
                setOrdenAtendida(false);
            }
    
            // Redirigir a la página de revisión
            navigate("/revisar");
        }
    });

    const rows = pacientes;
    const columns = [
        {
            field: 'actions',
            headerName: '',
            minWidth: 20,
            renderCell: (params) => (
                <>
                    <Checkbox size='small' checked={selectedPatient.some(p => p.id === params.row.id)} 
                        onChange={() => handleChange(params.row)} />
                </>
            )
        },
        {
            field: 'detalle',
            headerName: '',
            minWidth: 150,
            flex:1,
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleClickOpen(params.row)}>Ver Detalles</Button>  {/* Botón para abrir la modal */}
                </>
            )
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'fechaNacimiento',
            headerName: 'Fecha de nacimiento',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'numeroPoliza',
            headerName: 'Numero de Poliza',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'numeroSeguro',
            headerName: 'Numero de seguro',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'historiaMedica',
            headerName: 'Historia Médica',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'doctor',
            headerName: 'Doctor',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'estadoOrden',
            headerName: 'Estado de la orden',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>
        }
    ];

    return (
        <>
            <Box style={{ height: "80vh" }}>
                <h2>Bienvenido, En esta sección podrás encontrar los pacientes que tienes asignados para la atención de hoy</h2>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={3}
                    style={{ justifyContent: "center" }}
                >
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            style={{ backgroundColor: "white", height: "70vh" }}
                            columns={columns}
                            rows={rows}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10]}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick
                        />
                    </Box>
                    <Box component="form" onSubmit={onSubmit}>
                        <h1 style={{ margin: "0", width: "30vw" }}>Actualizar información</h1>
                        <Stack display="flex" justifyContent="center">
                            <InputLabel id="demo-simple-select-label" style={{ color: "white", marginTop: "1rem" }}>Actualizar estado de la orden</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={ordenEstado}
                                label="Estado"
                                onChange={handleChangeSelection}
                                fullWidth
                                required
                                style={{ marginTop: "2rem", backgroundColor: "white" }}
                            >
                                <MenuItem value="Solicitud Enviada">Solicitud Enviada</MenuItem>
                                <MenuItem value="Atendida">Atendida</MenuItem>
                            </Select>
                            <Button style={{ marginTop: "1rem", backgroundColor: "#cae16b", color: "black" }} type='submit'>Actualizar estado</Button>

                            {mensaje && (
                                <Box>
                                <Alert severity={mensaje === 'Se actualizó correctamente el estado de la orden para todos los pacientes seleccionados.' ? 'success' : 'error'} sx={{ mt: 2 }}>
                                    {mensaje}
                                </Alert>
                                <Alert severity={mensaje === 'Se actualizó correctamente el estado de la orden para todos los pacientes seleccionados.' ? 'info' : 'error'} sx={{ mt: 2 }}>
                                    Se realizó envio de correo electronico de confirmación correctamente
                                </Alert>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            {/* Modal para mostrar la información del paciente */}
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
                <DialogTitle>Información del Paciente</DialogTitle>
                <DialogContent>
                    {selectedPacienteInfo && (
                        <>
                        <DialogContentText>
                            <Typography variant="body1"><strong>Nombre:</strong> {selectedPacienteInfo.nombre}</Typography>
                            <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {selectedPacienteInfo.fechaNacimiento}</Typography>
                            <Typography variant="body1"><strong>Número de Póliza:</strong> {selectedPacienteInfo.numeroPoliza}</Typography>
                            <Typography variant="body1"><strong>Número de Seguro:</strong> {selectedPacienteInfo.numeroSeguro}</Typography>
                            <Typography variant="body1"><strong>Historia Médica:</strong> {selectedPacienteInfo.historiaMedica}</Typography>
                            <Typography variant="body1"><strong>Doctor:</strong> {selectedPacienteInfo.doctor}</Typography>
                            <Typography variant="body1"><strong>Estado de la Orden:</strong> {selectedPacienteInfo.estadoOrden}</Typography>
                        </DialogContentText>
                        <Typography variant="h6" style={{ marginTop: '1rem' }}>Archivos Adjuntos:</Typography>
                        <List>
                            {selectedPacienteInfo.archivoAdjunto && selectedPacienteInfo.archivoAdjunto.length > 0 ? (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Link href={selectedPacienteInfo.archivoAdjunto} target="_blank" rel="noopener noreferrer">
                                                {extractFileName(selectedPacienteInfo.archivoAdjunto)}
                                            </Link>
                                        }
                                    />
                                </ListItem>
                            ) : (
                                <ListItem>
                                    <Typography variant="body2">No hay archivos adjuntos</Typography>
                                </ListItem>
                            )}
                        </List>

                        </>
                    )}
                    <Box sx={{ marginTop: "2rem" }}>
                        {selectedPacienteInfo && (
                            <>
                                <Typography variant="h6">Estado de la orden:</Typography>
                                {selectedPacienteInfo.estadoOrden === "Sin iniciar" ? (
                                    <>
                                        {renderTimelineItem(
                                            `Solicitud revisada por Registros médicos - ${fechaSolicitudRevisada || "Fecha pendiente"}`,
                                            !!fechaSolicitudRevisada
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Enviada - ${fechaSolicitudEnviada || "Fecha pendiente"}`,
                                            !!fechaSolicitudAtendida
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Atendida - ${fechaSolicitudAtendida || "Fecha pendiente"}`,
                                            !!fechaSolicitudAtendida
                                        )}
                                    </>
                                ) : selectedPacienteInfo.estadoOrden === "Solicitud Enviada" ? (
                                    <>
                                        {renderTimelineItem(
                                            `Solicitud revisada por Registros médicos - ${fechaSolicitudRevisada || "Fecha pendiente"}`,
                                            !!fechaSolicitudRevisada
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Enviada - ${fechaSolicitudEnviada || "Fecha pendiente"}`,
                                            !!fechaSolicitudAtendida
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Atendida - ${fechaSolicitudAtendida || "Fecha pendiente"}`,
                                            !!fechaSolicitudAtendida
                                        )}
                                    </>
                                ) : selectedPacienteInfo.estadoOrden === "Atendida" ? (
                                    <>
                                        {renderTimelineItem(
                                            `Solicitud revisada por Registros médicos - ${fechaSolicitudRevisada || "Fecha pendiente"}`,
                                            !!fechaSolicitudRevisada
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Enviada - ${fechaSolicitudEnviada || "Fecha pendiente"}`,
                                            true
                                        )}
                                        {renderTimelineItem(
                                            `Solicitud Atendida - ${fechaSolicitudAtendida || "Fecha pendiente"}`,
                                            true
                                        )}
                                    </>
                                ) : null}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

