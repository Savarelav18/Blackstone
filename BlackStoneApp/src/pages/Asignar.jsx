import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; // Importar Toastify
import 'react-toastify/dist/ReactToastify.css';
import { getPacientesAsignados, getAllEmpleados, asignarPacienteAEmpleado } from "../api/empleados.api";
import { Box, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export const Asignar = () => {
  const [empleados, setEmpleados] = useState([]);
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    async function loadPacientes() {
      if (empleadoSeleccionado) {  // Solo cargamos si hay un empleado seleccionado
        try {
          // Cargamos pacientes asignados al empleado seleccionado
          const resEmpleadoSeleccionado = await getPacientesAsignados(empleadoSeleccionado);
          console.log("Pacientes asignados al empleado seleccionado:", resEmpleadoSeleccionado.data);

          // Cargamos los pacientes asignados al empleado con id = 3
          const resEmpleado3 = await getPacientesAsignados(3);
          console.log("Pacientes asignados al empleado con id = 3:", resEmpleado3.data);

          // Asegúrate de que ambos resultados son arrays
          const pacientesSeleccionado = Array.isArray(resEmpleadoSeleccionado.data) ? resEmpleadoSeleccionado.data : [];
          const pacientesEmpleado3 = Array.isArray(resEmpleado3.data) ? resEmpleado3.data : [];

          // Asignamos los pacientes del empleado seleccionado a la derecha (right)
          setRight(pacientesSeleccionado);

          // Asignamos los pacientes del empleado con id = 3 a la izquierda (left)
          setLeft(pacientesEmpleado3);

        } catch (error) {
          console.error("Error al cargar los pacientes:", error);
          notifyError("Error al cargar los pacientes. Revisa la consola para más detalles.");
        }
      }
    }

    loadPacientes();
  }, [empleadoSeleccionado]);
  // Se ejecuta cada vez que cambia el empleado seleccionado

  useEffect(() => {
    async function loadEmpleado() {
      try {
        const res = await getAllEmpleados();
        console.log("Datos de empleados:", res.data); // Verifica que sea un array
        setEmpleados(res.data);
      } catch (error) {
        console.error("Error al cargar los empleados:", error);
        notifyError("Error al cargar los empleados. Revisa la consola para más detalles.");
      }
    }
    loadEmpleado();
  }, []);

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = async () => {
    if (empleadoSeleccionado) {
      try {
        const pacientesSeleccionados = left.filter(paciente => checked.includes(paciente));
        const empleadosAsignados = await getPacientesAsignados(empleadoSeleccionado);
        const empleadosAsignadosId3 = await getPacientesAsignados(3);
        
        const diferencia = empleadosAsignados.data.length + pacientesSeleccionados.length - empleadosAsignadosId3.data.length;
        if (diferencia > 5) {
          notifyError("No debe existir una diferencia mayor a 5 pacientes entre los empleados.");
          return;
        }
  
        await Promise.all(pacientesSeleccionados.map(async (paciente) => {
          const res = await asignarPacienteAEmpleado(paciente.id, empleadoSeleccionado);
          if (res.status !== 200 && res.status !== 204) {
            throw new Error(`Error al asignar paciente ${paciente.id}`);
          }
        }));
  
        setRight(right.concat(pacientesSeleccionados));
        setLeft(left.filter(paciente => !pacientesSeleccionados.includes(paciente)));
        setChecked([]);
  
        notifySuccess("Pacientes seleccionados han sido asignados correctamente.");
      } catch (error) {
        console.error("Error durante la asignación de pacientes:", error);
        notifyError("Hubo un error al asignar los pacientes");
      }
    } else {
      notifyError("Debe seleccionar un empleado antes de asignar los pacientes.");
    }
  };

  const handleCheckedLeft = async () => {
    try {
      // Filtrar solo los pacientes seleccionados en `right`
      const pacientesSeleccionados = right.filter(paciente => checked.includes(paciente));

      // Asignar solo los pacientes seleccionados al empleado con ID 3
      await Promise.all(pacientesSeleccionados.map(async (paciente) => {
        const res = await asignarPacienteAEmpleado(paciente.id, 3); // Asignar al empleado con ID 3
        if (res.status !== 200 && res.status !== 204) {
          throw new Error(`Error al eliminar asignación  paciente ${paciente.id}`);
        }
      }));

      // Actualizar las listas después de la asignación
      setLeft(left.concat(pacientesSeleccionados)); // Añadir los pacientes asignados a la lista `left`
      setRight(right.filter(paciente => !pacientesSeleccionados.includes(paciente))); // Eliminar los pacientes asignados de la lista `right`
      setChecked([]); // Limpiar la selección de pacientes

      notifySuccess("Pacientes seleccionados están sin asignación.");
    } catch (error) {
      console.error("Error durante la asignación de pacientes:", error);
      notifyError("Hubo un error al asignar los pacientes");
    }
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 400,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.id}-label`;

          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.nombre}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const handleChangeSelection = (event) => {
    setEmpleadoSeleccionado(event.target.value);
  };

  return (
    <Box>
      <h1>Asignar pacientes a los empleados</h1>
      <p>Selecciona el empleado al que le deseas asignar nos pacientes</p>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={empleadoSeleccionado}
        label="Empleado"
        onChange={handleChangeSelection}
        fullWidth
        required
        style={{ marginTop: "2rem", backgroundColor: "white" }}
      >
        {empleados && empleados.length > 0 && empleados
          .filter(empleado => empleado.id !== 3)  // Filtramos empleados con id != 3
          .map(empleado => (
            <MenuItem key={empleado.id} value={empleado.id}>
              {empleado.nombre}
            </MenuItem>
          ))}
      </Select>
      
      
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'center', alignItems: 'center', marginTop:"4rem" }}
      >
        <Grid item>{customList('Pacientes Sin asignación', left)}</Grid>
        <Grid item>
          <Grid container direction="column" sx={{ alignItems: 'center' }}>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              style={{ cursor: "pointer", backgroundColor: "#cae16b", fontSize: "20px" }}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              style={{ cursor: "pointer", backgroundColor: "#cae16b", fontSize: "20px" }}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Pacientes Asignados', right)}</Grid>
      </Grid>

      <Accordion style={{borderRadius:"15px"}}>
        <AccordionSummary
          expandIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{marginTop:"3rem"}}
        >
          Instrucciones de asignación
        </AccordionSummary>
        <AccordionDetails>
        A la izquierda puedes encontrar a los pacientes que se encuentran actualmente sin asignación, solo debes seleccionar
        el paciente que deseas asignar y dar click sobre el botón con la flecha hacia el lado derecho.
        </AccordionDetails>
      </Accordion>

      <Accordion style={{borderRadius:"15px"}}>
        <AccordionSummary
          expandIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{marginTop:"3rem"}}
        >
          Instrucciones de eliminar asignación
        </AccordionSummary>
        <AccordionDetails>
        Si deseas eliminar una asignación de un paciente debes seleccionar el paciente en la lista derecha y hacer click sobre
        la flecha con dirección a la izquierda.
        </AccordionDetails>
      </Accordion>
      <ToastContainer />
    </Box>
  );
};
