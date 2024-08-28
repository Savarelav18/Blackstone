import { createContext, useState, useContext, useEffect } from 'react';
import { getAllEmpleados } from '../api/empleados.api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {

  const [empleados,setEmpleados] = useState()
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(()=>{
    async function loadEmpleados(){
      const res = await getAllEmpleados()
      setEmpleados(res.data)
    }
    loadEmpleados();
  },[])

  const login = (email, password)=> {
    const empleadoEncontrado = empleados.find(
      empleado => empleado.email === email && empleado.password === password
    );

    console.log(empleadoEncontrado.rol)

    if (empleadoEncontrado) {
      setUsuarioLogueado(empleadoEncontrado);
      setUserRole(empleadoEncontrado.rol)
      return true;
    } else {
      return false;
    }
  };

  

  const logout = () => {
    setUsuarioLogueado(null);
  };

  useEffect(() => {
    // Puede agregar lógica aquí para persistir el usuario logueado en localStorage o sesión
  }, [usuarioLogueado]);

  return (
    <AuthContext.Provider value={{ usuarioLogueado,userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
