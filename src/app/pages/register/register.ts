import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  // Formulario reactivo
  formRegistro!: FormGroup;

  // Variables de feedback visual
  error = '';
  exito = '';

  // Mostrar edad en vivo
  edadActual = 0;

  // Mostrar / ocultar contraseña
  mostrarPassword = false;
  mostrarPassword2 = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {

    // Construcción del formulario con todas las reglas
    this.formRegistro = this.fb.group(
      {
        nombre: ['', Validators.required],

        usuario: ['', Validators.required],

        email: ['', [Validators.required, Validators.email]],

        fechaNacimiento: ['', Validators.required],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(18),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // Seguridad
          ]
        ],

        password2: ['', Validators.required],

        direccion: ['']
      },
      {
        validators: [this.passwordsIgualesValidator]
      }
    );
  }

  // ============================================================
  // Validador personalizado de contraseñas iguales
  // ============================================================
  passwordsIgualesValidator(group: AbstractControl) {
    const pass1 = group.get('password')?.value;
    const pass2 = group.get('password2')?.value;

    return pass1 !== pass2 ? { noCoinciden: true } : null;
  }

  // ============================================================
  // Mostrar edad en tiempo real (evento input)
  // ============================================================
  calcularEdadEnVivo(event: any) {
    const fecha = event.target.value;
    if (!fecha) {
      this.edadActual = 0;
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    this.edadActual = edad;
  }

  // ============================================================
  // Botones ver / ocultar contraseña
  // ============================================================
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  togglePassword2() {
    this.mostrarPassword2 = !this.mostrarPassword2;
  }

  // ============================================================
  // Registrar usuario
  // ============================================================
  registrar() {
    this.error = '';
    this.exito = '';

    if (this.formRegistro.invalid) {
      this.error = 'Debes completar correctamente todos los campos.';
      this.formRegistro.markAllAsTouched();
      return;
    }

    const datos = this.formRegistro.value;

    const edad = this.calcularEdad(datos.fechaNacimiento);
    if (edad < 13) {
      this.error = 'Debes tener al menos 13 años para registrarte.';
      return;
    }

    const nuevoUsuario = {
      nombre: datos.nombre,
      usuario: datos.usuario,
      email: datos.email,
      password: datos.password,
      direccion: datos.direccion || '',
      tipo: 'usuario'
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    Swal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión con tus credenciales.',
      confirmButtonText: 'Ir a Iniciar Sesión',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  // Calcular edad final
  private calcularEdad(fecha: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  limpiar() {
    this.formRegistro.reset();
    this.error = '';
    this.exito = '';
    this.edadActual = 0;
  }
}
