from rest_framework import viewsets
from .serializer import PacienteSerializer
from .models import Paciente
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.


class PacienteView(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    queryset = Paciente.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["empleado"]
