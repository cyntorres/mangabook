import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Services } from '../services/services';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  formLogin!: FormGroup;

  error: boolean = false;

  constructor(
    private auth: Services,
    private router: RouterModule,
    private fb: FormBuilder
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  login() {
    this.error = false;

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const { email, password } = this.formLogin.value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const usuario = usuarios.find((u: any) =>
      u.email === email && u.password === password
    );

    if (usuario) {
      localStorage.setItem('sesion', JSON.stringify({
        logueado: true,
        usuario: usuario.usuario,
        tipo: usuario.tipo || 'usuario'
      }));

      window.location.assign(usuario.tipo === 'admin' ? '/admin' : '/perfil');

    } else {

      Swal.fire({
        icon: 'warning',
        title: 'Contraseña Incorrecta',
        text: 'La contraseña ingresada no es válida, por favor intenta nuevamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        timer: 5000,
        timerProgressBar: true
      });
    }
  }

  limpiar() {
    this.formLogin.reset();
    this.error = false;
  }
}

