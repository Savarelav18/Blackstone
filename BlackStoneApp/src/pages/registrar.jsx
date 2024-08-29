import { Alert, Box, Button, Container, Grid, Paper,TextField, Typography } from "@mui/material";
import {useForm} from "react-hook-form"
import { useState } from "react";
import { createPaciente } from "../api/empleados.api";
import { useNavigate } from "react-router-dom";


export const Registrar = () => {
    const [mensaje, setMensaje] = useState(null);
    const {register,handleSubmit} = useForm()
    const navigate = useNavigate()


  const onSubmit = handleSubmit(async data =>{
    const res= await createPaciente(data)
    console.log(res)
    if (res.status != 200 || res.status != 201){
        setMensaje("Ups. no fue posible registrar el usuario")
    }
    setMensaje("Se registró correctamente el usuario.")
    navigate("/")
  })

  return (
    <Container sx={{ mt: "auto" }} maxWidth="xl">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ padding: "2em", borderRadius: "0.5em" }}>
            <Typography variant="h4">Registrar Paciente</Typography>
            <Box component="form" onSubmit={onSubmit}>
              <TextField
                name="nombre"
                type="text"
                fullWidth
                label="Nombre"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                required
                {...register("nombre",{required:true})}
              />
              <TextField
                name="fechaNacimiento"
                type="text"
                fullWidth
                label="Fecha de Nacimiento"
                placeholder="dd/mm/aaaa"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("fechaNacimiento",{required:true})}
                required
              />
              <TextField
                name="numeroPoliza"
                type="text"
                fullWidth
                label="Número de póliza"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("numeroPoliza",{required:true})}
                required
              />
              <TextField
                name="numeroSeguro"
                type="text"
                fullWidth
                label="Número de seguro"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("numeroSeguro",{required:true})}
                required
              />
              <TextField
                name="historiaMedica"
                type="text"
                fullWidth
                label="Historia médica"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("historiaMedica",{required:true})}
                required
              />

              <TextField
                name="doctor"
                type="text"
                fullWidth
                label="Doctor"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("doctor",{required:true})}
                required
              />

              <TextField
                name="empleado"
                type="text"
                fullWidth
                label="Empleado"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("empleado",{required:true})}
                value={3}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5, mb: 3 }}
              >
                Registrar
              </Button>
            </Box>
            {mensaje && (
              <Alert severity={mensaje === 'Se registró correctamente el usuario.' ? 'success' : 'error'} sx={{ mt: 2 }}>
                {mensaje}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
