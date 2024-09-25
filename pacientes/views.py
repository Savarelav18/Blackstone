from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, F
from .serializer import PacienteSerializer
from .models import Paciente
from empleados.models import Empleados
from django_filters.rest_framework import DjangoFilterBackend


class PacienteView(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    queryset = Paciente.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["empleado"]

    def create(self, request, *args, **kwargs):
        numero_seguro = request.data.get("numeroSeguro")

        # Validar si el paciente ya está registrado
        if Paciente.objects.filter(numeroSeguro=numero_seguro).exists():
            return Response(
                {"detail": "El paciente ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Si no existe, proceder con la creación
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Nueva acción personalizada para estadísticas
    @action(detail=False, methods=["get"], url_path="estadisticas")
    def estadisticas(self, request):
        # Consulta para obtener las estadísticas de pacientes por empleado
        empleados_stats = Empleados.objects.annotate(
            total_pacientes=Count("pacientes"),
            promedio_atencion=Avg(
                F("pacientes__fecha_fin_atencion")
                - F("pacientes__fecha_inicio_atencion")
            ),
        )

        # Preparar los datos para el frontend o la respuesta
        data = [
            {
                "nombre": empleado.nombre,
                "total_pacientes": empleado.total_pacientes,
                "promedio_atencion": (
                    empleado.promedio_atencion.days
                    if empleado.promedio_atencion
                    else None
                ),
            }
            for empleado in empleados_stats
        ]

        # Devolver la respuesta como JSON
        return Response(data)
