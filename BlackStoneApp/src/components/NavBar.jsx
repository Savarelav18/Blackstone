import { AppBar, Box, Button, Container, Toolbar, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
    const managerPages = ['Revisar','Gestionar', 'Asignar','Registrar','Estadisticas'];
    const agentePages = ['Revisar','Registrar'];
    const { usuarioLogueado,userRole, logout } = useAuth();
    const navigate = useNavigate()  // Asegúrate de que isAuthenticated se obtiene correctamente
    let pages = [];

    if (userRole === 'manager') {
        pages = managerPages;
    } else if (userRole === 'agente') {
        pages = agentePages;
    }

    return (
        <AppBar position="fixed" style={{ backgroundColor: "#272727" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <img src="https://www.blackstonemedicalservices.com/wp-content/uploads/logo-transparent.png" alt="Logo" />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {usuarioLogueado  && userRole ? (
                            pages.map((page) => (
                                <Link key={page} to={`/${page.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                                    <Button sx={{ my: 2, color: "white", display: 'block' }}>
                                        {page}
                                    </Button>
                                </Link>
                            ))
                        ) : null}
                            
                    </Box>
                    {usuarioLogueado ? (
                            <Link to="/" style={{ textDecoration: 'none' }}>
                            <Tooltip title="Logout">
                                <Button onClick={logout} sx={{ my: 2, color: "white" }}>
                                    Logout
                                </Button>
                            </Tooltip>
                            </Link>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button sx={{ my: 2, color: "white" }}>
                                    Login
                                </Button>
                            </Link>
                        )}

                    
                </Toolbar>
            </Container>
        </AppBar>
    );
};
