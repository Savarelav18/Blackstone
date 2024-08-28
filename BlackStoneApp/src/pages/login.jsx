import { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Para redirigir después del login

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Usamos navigate para redirigir
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginExitoso = login(email, password);

    if (loginExitoso) {
      setMensaje('Login exitoso.');
      navigate('/'); // Redirige al dashboard o a otra página
    } else {
      setMensaje('Error: email o contraseña incorrectos.');
    }
  };

  return (
    <Container sx={{ mt: 3 }} maxWidth="sm">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            <Typography variant="h4">Iniciar sesión</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                type="email"
                fullWidth
                label="Email"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                fullWidth
                label="Password"
                sx={{ mt: 2, mb: 2.5 }}
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5, mb: 3 }}
              >
                Iniciar sesión
              </Button>
            </Box>
            {mensaje && (
              <Alert severity={mensaje === 'Login exitoso.' ? 'success' : 'error'} sx={{ mt: 2 }}>
                {mensaje}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
