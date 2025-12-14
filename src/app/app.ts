// //COMPONENTES
// import { Navbar } from './components/navbar/navbar';
// import { Footer } from './components/footer/footer';

// //SE IMPORTA PARA PODER USAR:
// // * FORMGROUP
// // * FORMCONTROL
// // * FORMBUILDER
// // * VALIDATORS
// import { ReactiveFormsModule } from '@angular/forms';

// //ME PERMITE USAR: 
// // * ngIf
// // * ngFor
// import { CommonModule } from '@angular/common';

// //DEFINE LA ESTRUCTURA Y EL COMPORTAMIENTO DEL COMPONENTE (COMPONENT) FRONT
// //GESTIONA SU ESTADO Y MANIPULA LOS DATOS (SIGNAL). BACK
// import { Component, signal } from '@angular/core';

// //MUESTRA EL CONTENIDO DE LA PAGINA SOLICITADA
// import { RouterOutlet } from '@angular/router';


// @Component({
//   selector: 'app-root',
//   imports: [Navbar, Footer, ReactiveFormsModule, CommonModule, RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('mangabook');
// }


// src/app/app.ts

// MÓDULOS BASE
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// COMPONENTES
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

// IMPORTACIONES CRÍTICAS DE ANGULAR CORE/ROUTER
import { Component, signal, OnInit } from '@angular/core'; // AGREGAR OnInit
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'; // AGREGAR Router y NavigationEnd
import { filter } from 'rxjs/operators'; // Necesario para filtrar eventos del router

@Component({
  selector: 'app-root',
  // Mantener las importaciones existentes
  imports: [Navbar, Footer, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
// Implementar OnInit para usar el ciclo de vida
export class App implements OnInit {

  protected readonly title = signal('mangabook');

  // 🛑 CORRECCIÓN CRÍTICA: Definir la variable que usa el *ngIf
  showFooter: boolean = true;

  // Inyectar el Router
  constructor(private router: Router) { }

  ngOnInit() {
    // Suscribirse a los eventos de navegación para saber cuándo cambiar la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      const currentUrl = event.urlAfterRedirects;

      // Ocultar el footer si la URL contiene '/panel' o '/login'
      // this.showFooter = !currentUrl.includes('/panel') && 
      this.showFooter = !currentUrl.includes('/login') && !currentUrl.includes('/registro');

      // Si quieres que quede pegado al final (Sticky Footer), asegúrate de que 
      // tienes el CSS Flexbox aplicado a app-root y a la etiqueta main.
    });
  }
}