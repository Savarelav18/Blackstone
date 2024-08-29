import {Box,Stack,Divider, Button, Checkbox, Alert} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllEmpleados, actualizarEstadoEmpleado } from '../api/empleados.api';
import {useForm} from "react-hook-form"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export const Gestionar = () =>{


    const [empleados,setEmpleados]= useState([])
    const {usuarioLogueado} = useAuth()
    const { register, handleSubmit, setValue, watch } = useForm();
    const [mensaje, setMensaje] = useState(null);

    const selectedEmpleado = watch("selectedEmpleado") || [];

    const [rol, setRol] = useState("");

    const handleChangeSelection = (event) => {
        setRol(event.target.value);
    };

    

    useEffect(()=>{
        async function loadEmpleado() {
            try {
                const res = await getAllEmpleados();
                setEmpleados(res.data);
            } catch (error) {
                console.error("Error al cargar los pacientes:", error);
            }
        }

        if (usuarioLogueado) {
            loadEmpleado();
        }
    }, [usuarioLogueado]);

    useEffect(() => {
    }, [empleados]);

    const handleChange = (empleado) => {
        const isSelected = selectedEmpleado.some(p => p.id === empleado.id);
        const updatedSelection = isSelected 
            ? selectedEmpleado.filter(p => p.id !== empleado.id) 
            : [...selectedEmpleado, empleado];
        
        setValue("selectedEmpleado", updatedSelection);
    };

    const onSubmit = handleSubmit(async (data) =>{
        const res= await actualizarEstadoEmpleado(data.selectedEmpleado[0].id,data.selectedEmpleado.map(empleado => ({...empleado,rol: rol}))[0])
        console.log(res)
        if (res.status != 200 || res.status != 201){
            setMensaje("Ups. no fue posible registrar el usuario")
        }
        setMensaje("Se actualizó correctamente el estado de la orden.")

        
    })

    const rows = empleados
    const columns = [
        {
            field:'actions',
            headerName:'',
            minWidth:50,
            renderCell:(params)=><>
            <Checkbox size='sm' checked={selectedEmpleado.some(p => p.id === params.row.id)} 
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
            field:'email',
            headerName:'Correo',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'rol',
            headerName:'Rol',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        },
        {
            field:'departamento',
            headerName:'Departamento',
            flex:1,
            minWidth:150,
            renderCell:(params)=><>{params.value}</>
        }
      ];
      
      
    return(
    <>
    <Box style={{height:"80vh"}}>
        <h2>Bienvenido, En esta sección podrás modificar los roles de los empleados</h2>
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
                <InputLabel id="demo-simple-select-label" style={{color:"white",marginTop:"1rem"}}>Actualizar rol del empleado</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={rol}
                label="Age"
                onChange={handleChangeSelection}
                fullWidth
                required
                style={{marginTop:"2rem" , backgroundColor:"white"}}
                >
                <MenuItem value="agente">agente</MenuItem>
                <MenuItem value="manager">manager</MenuItem>
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
