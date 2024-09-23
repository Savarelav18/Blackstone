# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Paciente


@receiver(post_save, sender=Paciente)
def enviar_correo_solicitud_enviada(sender, instance, **kwargs):
    # Verificar si el estado de la orden ha cambiado a "Solicitud Enviada"
    if instance.estadoOrden == "Solicitud Enviada":
        # Crear el correo con el encabezado de confirmación de lectura
        email1 = EmailMessage(
            subject="Tu solicitud ha sido enviada",
            body=f'Estimado {instance.nombre},\n\nTu solicitud ha sido actualizada a "Solicitud Enviada".',
            from_email="savarelav@unal.edu.co",
            to=[settings.DEFAULT_RECIPIENT_EMAIL],
            headers={
                "Disposition-Notification-To": "savarelav@unal.edu.co"
            },  # Encabezado de confirmación
        )
        email1.send(fail_silently=False)
        email2 = EmailMessage(
            subject=f"Solicitud de información de registros médicos del paciente {instance.nombre}",
            body=f'Estimado Doctor {instance.doctor},\n\n se requiere los documentos adicionales relacionados con el paciente {instance.nombre} para continuar con el proceso de atención de la apnea del sueño\n\n a continuación encontrará información relevante del paciente".\n\n {instance.historiaMedica}\n\n {instance.numeroPoliza}\n\n {instance.archivoAdjunto}\n\n',
            from_email="savarelav@unal.edu.co",
            to=[settings.DOCTOR_RECIPIENT_EMAIL],
            headers={
                "Disposition-Notification-To": "savarelav@unal.edu.co"
            },  # Encabezado de confirmación
        )
        email2.send(fail_silently=False)

    elif instance.estadoOrden == "Atendida":
        # Crear el correo con el encabezado de confirmación de lectura
        email = EmailMessage(
            subject="Tu solicitud ha sido Atendida",
            body=f'Estimado {instance.nombre},\n\nTu solicitud ha sido actualizada a "Atendida".',
            from_email="savarelav@unal.edu.co",
            to=[settings.DEFAULT_RECIPIENT_EMAIL],
            headers={
                "Disposition-Notification-To": "savarelav@unal.edu.co"
            },  # Encabezado de confirmación
        )
        email.send(fail_silently=False)
