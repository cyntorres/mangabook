import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recover.html',
  styleUrl: './recover.css',
})
export class Recover {

  // Formulario reactivo
  formRecover!: FormGroup;

  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder) {
    // Inicialización del FormGroup
    this.formRecover = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ===============================================
  // Recuperación de contraseña
  // ===============================================
  recuperar() {
    this.mensaje = '';
    this.error = '';

    // Validar formulario
    if (this.formRecover.invalid) {
      this.formRecover.markAllAsTouched();
      return;
    }

    const email = this.formRecover.value.email;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
      this.error = 'Usuario no encontrado con ese correo.';
    } else {
      this.mensaje = `Hola ${usuario.nombre}, tu contraseña es: ${usuario.password}`;
    }
  }

  // Limpiar
  limpiar() {
    this.formRecover.reset();
    this.error = '';
    this.mensaje = '';
  }
}
