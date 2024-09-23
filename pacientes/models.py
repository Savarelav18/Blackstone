from django.db import models
from empleados.models import Empleados
from datetime import datetime


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
    archivoAdjunto = models.FileField(
        upload_to="archivos_pacientes/", null=True, blank=True
    )
    fecha_inicio_atencion = models.DateTimeField(
        null=True, blank=True
    )  # Fecha cuando se inicia la atención
    fecha_fin_atencion = models.DateTimeField(
        null=True, blank=True
    )  # Fecha cuando se finaliza la atención

    def __str__(self) -> str:
        return self.nombre

    @property
    def tiempo_atencion(self):
        """Devuelve el tiempo que tomó la atención en días, si está disponible"""
        if self.fecha_inicio_atencion and self.fecha_fin_atencion:
            return (self.fecha_fin_atencion - self.fecha_inicio_atencion).days
        return None
