# Generated by Django 5.1 on 2024-08-28 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empleados', '0001_initial'),
        ('pacientes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleados',
            name='pacientes',
            field=models.ManyToManyField(related_name='empleados', to='pacientes.paciente'),
        ),
    ]
