from django.urls import path, include
from rest_framework import routers
from pacientes import views
from rest_framework.documentation import include_docs_urls

router = routers.DefaultRouter()
router.register(r"paciente", views.PacienteView, basename="paciente")

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="Paciente API")),
]
