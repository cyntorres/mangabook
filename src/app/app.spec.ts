import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs'; // Necesario para Observables simulados

import { App } from './app';
// Asumiendo que el componente App o Navbar inyecta este servicio:
import { Services } from './pages/services/services';

// 1. CLASE MOCK: Simula el servicio que maneja la sesión (AuthService o Services)
class MockServices {
  // Proporcionar la propiedad Observable que el Navbar intenta suscribir
  sesion$ = of({ logueado: true, usuario: 'test', tipo: 'user' });
}

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // El componente App es standalone y se importa a sí mismo.
      // Sus importaciones directas (Navbar, RouterOutlet, etc.) son manejadas automáticamente.
      imports: [App, CommonModule, ReactiveFormsModule],

      providers: [
        // 🛑 CORRECCIÓN 1: Provee el Router para resolver RouterOutlet y RouterLink
        provideRouter([]),
        // 🛑 CORRECCIÓN 2: Mock del servicio que Navbar necesita para la sesión
        { provide: Services, useClass: MockServices }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  // ======================================================================
  // TEST 1: Creación del componente (Soluciona "should create the app" failed)
  // ======================================================================
  it('should create the app', () => {
    // Asegura que la instancia del componente se haya creado sin errores de inyección
    expect(component).toBeTruthy();
  });

  // ======================================================================
  // TEST 2: Renderizado del título (Soluciona "should render title" failed)
  // ======================================================================
  it('should display the correct title (MANGABOOK)', async () => {
    // 🛑 CORRECCIÓN: Esperar la estabilidad para que todos los hijos (Navbar) se rendericen
    await fixture.whenStable();

    // Forzamos la detección de cambios para que Angular renderice el HTML
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const content = compiled.textContent ? compiled.textContent.trim() : '';
    expect(content).toContain('MANGABOOK');
  });
});