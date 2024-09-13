import axios from "axios"

const EmpleadosApi = axios.create({
    baseURL:"http://127.0.0.1:8000/empleados/api/v1/empleado"
})

const PacienteApi = axios.create({
    baseURL:"http://127.0.0.1:8000/pacientes/api/v1/paciente/"
})


export const getAllEmpleados = () =>{
    return EmpleadosApi.get('/')
}


export const createPaciente = (paciente) =>{
    return PacienteApi.post("/",paciente)
}

export const getPacientesAsignados = (empleado) =>{
    return PacienteApi.get(`http://127.0.0.1:8000/pacientes/api/v1/paciente/?empleado=${empleado}`)
}

export const actualizarEstado = (pacienteid,parametro) =>{
    return PacienteApi.put(`/${pacienteid}/`,parametro)
}

export const actualizarEstadoEmpleado = (empleadoId,parametro) =>{
    return EmpleadosApi.put(`/${empleadoId}/`,parametro)
}

export const asignarPacienteAEmpleado = async (pacienteId, empleadoId) => {
    try {
        // Realiza la solicitud PATCH al servidor
        const response = await PacienteApi.patch(`${pacienteId}/`, {
            empleado: empleadoId // Asume que la propiedad del empleado es `empleado`
        });
        return response;
    } catch (error) {
        console.error("Error al asignar el paciente:", error);
        throw error;
    }
};