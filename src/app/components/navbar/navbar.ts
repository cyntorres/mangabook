import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Services } from '../../pages/services/services';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  sesion: any = null;

  constructor(private auth: Services, private router: Router) { }

  ngOnInit(): void {
    this.auth.sesion$.subscribe(sesion => {
      this.sesion = sesion;
    });
  }

  cerrarSesion() {
    console.log("🔴 Cerrando sesión...");
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}