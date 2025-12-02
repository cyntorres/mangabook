import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  formPerfil!: FormGroup;
  usuarios: any[] = [];
  // Ya no necesitamos la variable 'mensaje'

  // Ver / ocultar contraseña
  mostrarPassword = false;

  // Para solucionar el error de guardado al cambiar el usuario,
  // almacenamos el usuario original.
  usuarioOriginal: string = ''; 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const sesionStr = localStorage.getItem('sesion');
    const sesion = sesionStr ? JSON.parse(sesionStr) : null;

    const usuariosStr = localStorage.getItem('usuarios');
    this.usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    const usuarioCompleto = this.usuarios.find(
      (u) => u.usuario === sesion?.usuario
    );
    
    // Guardar el nombre de usuario original para la búsqueda en 'guardarCambios'
    this.usuarioOriginal = usuarioCompleto?.usuario || '';

    // Formulario
    this.formPerfil = this.fb.group({
      nombre: [usuarioCompleto?.nombre, Validators.required],
      usuario: [usuarioCompleto?.usuario, Validators.required],
      email: [{ value: usuarioCompleto?.email, disabled: true }],
      password: [
        usuarioCompleto?.password,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      tipo: [{ value: usuarioCompleto?.tipo, disabled: true }],
    });
  }

  // Ver/ocultar password
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // 2. Modificar la función guardarCambios() para usar Swal.fire()
  guardarCambios() {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      // Mostrar alerta si la validación falla
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Por favor, revisa los campos del formulario. La contraseña requiere al menos 6 caracteres, una mayúscula y un número.',
      });
      return;
    }

    const datosEditados = this.formPerfil.getRawValue();

    // Usamos el usuario original como identificador para la búsqueda (solución al problema anterior)
    const index = this.usuarios.findIndex((u) => u.usuario === this.usuarioOriginal);

    if (index !== -1) {
      // 💾 Lógica de guardado
      this.usuarios[index] = { ...this.usuarios[index], ...datosEditados };

      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      localStorage.setItem('sesion', JSON.stringify(this.usuarios[index]));
      
      // Actualizamos el usuario original por si el nombre de usuario ha cambiado
      this.usuarioOriginal = datosEditados.usuario;

      // Mostrar SweetAlert de Éxito 🎉
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Los cambios en tu perfil han sido guardados correctamente.',
        confirmButtonText: 'Aceptar',
      });
    } else {
      // Mostrar SweetAlert de Error si no se encuentra el usuario 🚫
      Swal.fire({
        icon: 'error',
        title: 'Error de Actualización',
        text: 'No se pudo encontrar el usuario para actualizar. Intenta cerrar y volver a iniciar sesión.',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}