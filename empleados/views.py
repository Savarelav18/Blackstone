from rest_framework import viewsets
from .serializer import EmpleadoSerializer
from .models import Empleados

# Create your views here.


class EmpleadoView(viewsets.ModelViewSet):
    serializer_class = EmpleadoSerializer
    queryset = Empleados.objects.all()
