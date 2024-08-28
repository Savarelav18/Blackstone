from django.db import models


class Empleados(models.Model):
    nombre = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    rol = models.CharField(max_length=200)
    departamento = models.CharField(max_length=200)
    fotoPerfil = models.CharField(max_length=200)

    def __str__(self) -> str:
        return self.nombre
