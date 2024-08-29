import {Box,Stack,Divider, Button, Checkbox, Alert} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { actualizarEstado, getPacientesAsignados } from '../api/empleados.api';
import { useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const Revisar=()=>{

    const [pacientes,setPacientes]= useState([])
    const {usuarioLogueado} = useAuth()
    const { register, handleSubmit, setValue, watch } = useForm();
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate()

    const selectedPatient = watch("selectedPatient") || [];

    const [ordenEstado, setOrdenEstado] = useState("");

    const handleChangeSelection = (event) => {
        setOrdenEstado(event.target.value);
    };

    

    useEffect(()=>{
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

    useEffect(() => {
    }, [pacientes]);


    const handleChange = (paciente) => {
        const isSelected = selectedPatient.some(p => p.id === paciente.id);
        const updatedSelection = isSelected 
            ? selectedPatient.filter(p => p.id !== paciente.id) 
            : [...selectedPatient, paciente];
        
        setValue("selectedPatient", updatedSelection);
    };

    const onSubmit = handleSubmit(async (data) =>{
        const res= await actualizarEstado(data.selectedPatient[0].id,data.selectedPatient.map(patient => ({...patient,estadoOrden: ordenEstado}))[0])
        console.log(res)
        if (res.status != 200 || res.status != 201){
            setMensaje("Ups. no fue posible registrar el usuario")
        }
        setMensaje("Se actualizó correctamente el estado de la orden.")
        navigate("/revisar")
        
    })


    const rows = pacientes
    const columns = [
        {
            field:'actions',
            headerName:'',
            minWidth:50,
            renderCell:(params)=><>
            <Checkbox size='sm' checked={selectedPatient.some(p => p.id === params.row.id)} 
                    onChange={() => handleChange(params.row)}/>
            </>
        },
        {
            field:'nombre',
            headerName:'Nombre',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'fechaNacimiento',
            headerName:'Fecha de nacimiento',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'numeroPoliza',
            headerName:'Numero de Poliza',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'numeroSeguro',
            headerName:'Numero de seguro',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'historiaMedica',
            headerName:'Historia Médica',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'doctor',
            headerName:'Doctor',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'estadoOrden',
            headerName:'Estado de la orden',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        }
      ];
      
      
    return(
    <>
    <Box style={{height:"80vh"}}>
        <h2>Bienvenido, En esta sección podrás encontrar los pacientes que tienes asignados para la atención de hoy</h2>
        <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem/>}
        spacing={3}
        style={{justifyContent:"center"}}
        >
           <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
            
            style={{backgroundColor:"white",height:"70vh"}}
            columns={columns}
            rows = {rows}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 10,
                },
            },
            }}
            pageSizeOptions={[10]}
            getRowId={(row)=>row.id}
            disableRowSelectionOnClick
        />
            </Box>
        <Box component="form" onSubmit={onSubmit}>
            <h1 style={{margin:"0", width:"30vw"}}>Actualizar información</h1>
            <Stack  display="flex" justifyContent="center" >
                <InputLabel id="demo-simple-select-label" style={{color:"white",marginTop:"1rem"}}>Actualizar estado de la orden</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ordenEstado}
                label="Age"
                onChange={handleChangeSelection}
                fullWidth
                required
                style={{marginTop:"2rem" , backgroundColor:"white"}}
                >
                <MenuItem value="Solicitud_Enviada">Solicitud Enviada</MenuItem>
                <MenuItem value="Atentida">Atendida</MenuItem>
                </Select>

                <Button style={{marginTop:"1rem",backgroundColor:"#cae16b",color:"black"}} type='submit'>Actualizar estado</Button>

                {mensaje && (
                    <Alert severity={mensaje === 'Se actualizó correctamente el estado de la orden.' ? 'success' : 'error'} sx={{ mt: 2 }}>
                {mensaje}
              </Alert>
            )}
            </Stack>
        </Box>
        </Stack>
        
        </Box>
    </>
    )
}