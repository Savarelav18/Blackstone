import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllEmpleados } from '../api/empleados.api';

export const Revisar=()=>{

    const [empleado,setEmpleados]= useState()
    const {usuarioLogueado} = useAuth()

    useEffect(()=>{
        async function loadEmpleado(){
            const res = await getAllEmpleados()
            setEmpleados(res.data)
        }
        loadEmpleado();
      },[])


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 150,
          editable: true,
        },
        {
          field: 'FechaNacimiento',
          headerName: 'Fecha de Nacimiento',
          width: 150,
          editable: true,
        },
        {
          field: 'NumeroPoliza',
          headerName: 'Numero de poliza',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
          field: 'NumeroSeguro',
          headerName: 'Numero de Seguro',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'HistoriaMedica',
            headerName: 'Historia Medica',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
          },
        
        {
            field: 'EstadoOrden',
            headerName: 'Estado de la Orden',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
      ];
      
      
    return(
    <>
        <h2>Bienvenido, En esta sección podrás encontrar los pacientes que tienes asignados para la atención de hoy</h2>
        <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
            style={{backgroundColor:"white"}}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 5,
                },
            },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
        />
        </Box>
    </>
    )
}