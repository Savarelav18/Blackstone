from django.db import models
from empleados.models import Empleados


class Paciente(models.Model):
    nombre = models.CharField(max_length=200)
    fechaNacimiento = models.CharField(max_length=200)
    numeroPoliza = models.CharField(max_length=200)
    numeroSeguro = models.CharField(max_length=200)
    historiaMedica = models.CharField(max_length=200)
    doctor = models.CharField(max_length=200)
    estadoOrden = models.CharField(max_length=200, default="Sin iniciar")
    empleado = models.ForeignKey(
        Empleados, on_delete=models.CASCADE, related_name="pacientes", default=1
    )

    def __str__(self) -> str:
        return self.nombre
