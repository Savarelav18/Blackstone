from django.db import models


class Paciente(models.Model):
    nombre = models.CharField(max_length=200)
    fechaNacimiento = models.CharField(max_length=200)
    numeroPoliza = models.CharField(max_length=200)
    numeroSeguro = models.CharField(max_length=200)
    historiaMedica = models.CharField(max_length=200)
    estadoOrden = models.CharField(max_length=200, default="Sin iniciar")

    def __str__(self) -> str:
        return self.nombre
