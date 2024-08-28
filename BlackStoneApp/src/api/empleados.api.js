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