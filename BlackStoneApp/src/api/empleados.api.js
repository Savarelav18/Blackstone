import axios from "axios"

const EmpleadosApi = axios.create({
    baseURL:"http://127.0.0.1:8000/empleados/api/v1/empleado"
})

const PacienteApi = axios.create({
    baseURL: "http://127.0.0.1:8000/pacientes/api/v1/paciente/",
});


export const getAllEmpleados = () =>{
    return EmpleadosApi.get('/')
}


export const createPaciente = (paciente) =>{
    return PacienteApi.post("/",paciente)
}

export const getPacientesAsignados = (empleado) =>{
    return PacienteApi.get(`http://127.0.0.1:8000/pacientes/api/v1/paciente/?empleado=${empleado}`)
}

export const actualizarEstadoFechaInicio = (pacienteid, nuevoEstado,fecha_inicio) => {
    return PacienteApi.patch(`/${pacienteid}/`, { estadoOrden: nuevoEstado, fecha_inicio_atencion:fecha_inicio}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const actualizarEstadoFechaFin = (pacienteid, nuevoEstado,fecha_fin) => {
    return PacienteApi.patch(`/${pacienteid}/`, { estadoOrden: nuevoEstado,fecha_fin_atencion:fecha_fin}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

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