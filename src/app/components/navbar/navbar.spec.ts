// --- DENTRO DE navbar.spec.ts ---

import { ComponentFixture, TestBed } from '@angular/core/testing';
// ✅ CORRECCIÓN 1: Agregar el import de provideRouter
import { provideRouter } from '@angular/router'; 
// ✅ CORRECCIÓN 2: Agregar CommonModule (necesario para *ngIf, *ngFor)
import { CommonModule } from '@angular/common'; 
// ✅ CORRECCIÓN 3: Agregar of (para simular Observables)
import { of } from 'rxjs'; 

import { Navbar } from './navbar'; 
// Asumimos que inyecta un AuthService para manejar el estado de la sesión
import { Services } from '../../pages/services/services';

// CLASE MOCK: Simula el servicio que Navbar inyecta
class MockAuthService {
    // Proporcionar la propiedad Observable que el Navbar intenta suscribir
    sesion$ = of({ logueado: true, usuario: 'test', tipo: 'user' }); 
}

describe('Navbar', () => {

    let component: Navbar;
    let fixture: ComponentFixture<Navbar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            // ✅ Navbar (Standalone) y CommonModule
            imports: [Navbar, CommonModule], 
            
            providers: [
                // 🛑 provideRouter para resolver los errores de RouterLink
                provideRouter([]),
                // 🛑 Mock del servicio que maneja la sesión
                { provide: Services, useClass: MockAuthService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Navbar);
        component = fixture.componentInstance;
        // Inicializa el componente y la suscripción al servicio mock
        fixture.detectChanges(); 
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});