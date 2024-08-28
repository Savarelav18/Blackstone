from django.urls import path, include
from rest_framework import routers
from empleados import views
from rest_framework.documentation import include_docs_urls

router = routers.DefaultRouter()
router.register(r"empleado", views.EmpleadoView, "empleado")

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="Empleado API")),
]
