import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPaciente } from "../api/empleados.api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'; // Importar Toastify
import 'react-toastify/dist/ReactToastify.css';

export const Registrar = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await createPaciente(data);
      if (res.status === 201) {
        notifySuccess("Paciente registrado correctamente.");
        reset(); // Limpiar el formulario
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Mostrar mensaje de error si el paciente ya existe
        notifyError(error.response.data.detail || "Error al registrar paciente.");
      } else {
        notifyError("Ocurrió un error inesperado.");
      }
    }
  });

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
                {...register("nombre", { required: true })}
              />
              <TextField
                name="fechaNacimiento"
                type="text"
                fullWidth
                label="Fecha de Nacimiento"
                placeholder="dd/mm/aaaa"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("fechaNacimiento", { required: true })}
                required
              />
              <TextField
                name="numeroPoliza"
                type="text"
                fullWidth
                label="Número de póliza"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("numeroPoliza", { required: true })}
                required
              />
              <TextField
                name="numeroSeguro"
                type="text"
                fullWidth
                label="Número de seguro"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("numeroSeguro", { required: true })}
                required
              />
              <TextField
                name="historiaMedica"
                type="text"
                fullWidth
                label="Historia médica"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("historiaMedica", { required: true })}
                required
              />
              <TextField
                name="doctor"
                type="text"
                fullWidth
                label="Doctor"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("doctor", { required: true })}
                required
              />
              <TextField
                name="empleado"
                type="text"
                fullWidth
                label="Empleado"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                {...register("empleado", { required: true })}
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
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer /> {/* Contenedor para las notificaciones de Toastify */}
    </Container>
  );
};
