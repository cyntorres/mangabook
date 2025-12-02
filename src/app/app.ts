//COMPONENTES
import { Navbar } from './components/navbar/navbar';

//SE IMPORTA PARA PODER USAR:
// * FORMGROUP
// * FORMCONTROL
// * FORMBUILDER
// * VALIDATORS
import { ReactiveFormsModule } from '@angular/forms';

//ME PERMITE USAR: 
// * ngIf
// * ngFor
import { CommonModule } from '@angular/common';

//DEFINE LA ESTRUCTURA Y EL COMPORTAMIENTO DEL COMPONENTE (COMPONENT) FRONT
//GESTIONA SU ESTADO Y MANIPULA LOS DATOS (SIGNAL). BACK
import { Component, signal } from '@angular/core';

//MUESTRA EL CONTENIDO DE LA PAGINA SOLICITADA
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [Navbar, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mangabook');
}
