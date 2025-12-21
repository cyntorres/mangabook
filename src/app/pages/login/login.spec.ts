// login.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router'; 
import { vi } from 'vitest'; 
import { Login } from './login'; 
import { Services } from '../services/services'; 
import Swal from 'sweetalert2'; // Necesario para espiar el uso de Swal

// --- PREPARACIÓN DE DATOS Y MOCKS ---

// Definición de usuarios de prueba
const mockUser = { usuario: 'juanito', email: 'test@test.cl', password: 'Admin123!', tipo: 'usuario' };
const mockAdmin = { usuario: 'admin_test', email: 'admin@test.cl', password: 'Admin123!', tipo: 'admin' };

// Mock para el servicio 'Services' (para satisfacer la inyección)
class MockServices {} 

// 🛑 PREPARACIÓN GLOBAL DEL ESPÍA DE window.location
const assignSpy = vi.fn(); 
Object.defineProperty(window, 'location', {
    value: { assign: assignSpy },
    writable: true 
});

describe('Login', () => {

    let component: Login;
    let fixture: ComponentFixture<Login>;
    let router: Router; 
    let swalSpy: any; // Espía para el SweetAlert

    beforeEach(async () => {
        // Espía el Swal.fire (Necesario para el manejo de errores)
        swalSpy = vi.spyOn(Swal, 'fire').mockImplementation(() => Promise.resolve({ isConfirmed: true } as any));

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, Login], 
            providers: [
                provideRouter([]), 
                { provide: Services, useClass: MockServices } 
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); 
        
        // 🛑 LIMPIEZA CRUCIAL: Resetea los espías entre tests
        assignSpy.mockClear(); 
        swalSpy.mockClear();
        localStorage.clear(); // Limpiar el localStorage
        
        fixture.detectChanges();
    });
    
    // ======================================================================
    // TEST 1: Formulario Inválido (Validación)
    // ======================================================================
    it('debería marcar el formulario como tocado y detener la ejecución si es inválido', () => {
        // Aseguramos que el formulario esté inválido
        expect(component.formLogin.invalid).toBe(true);

        component.login();

        // Verifica que la redirección NO haya sido llamada
        expect(assignSpy).not.toHaveBeenCalled();
        // Verifica que los campos sean marcados (muestra errores al usuario)
        expect(component.formLogin.get('email')?.touched).toBe(true);
    });

    // ======================================================================
    // TEST 2: Credenciales Incorrectas (Manejo de error con Swal)
    // ======================================================================
    it('debería mostrar un SweetAlert si las credenciales no coinciden', () => {
        // Prepara el localStorage con datos correctos
        localStorage.setItem('usuarios', JSON.stringify([mockUser]));

        // Entra credenciales INCORRECTAS (correo inexistente)
        component.formLogin.get('email')?.setValue('inexistente@test.cl');
        component.formLogin.get('password')?.setValue(mockUser.password);

        component.login();

        // 1. Verifica que el SweetAlert se haya llamado (el error)
        expect(swalSpy).toHaveBeenCalled();
        // 2. Verifica que la redirección NO haya sido llamada
        expect(assignSpy).not.toHaveBeenCalled();
    });

    // ======================================================================
    // TEST 3: Login Exitoso (Usuario Estándar)
    // ======================================================================
    it('debería crear sesión y redirigir al usuario estándar a /perfil', () => {
        localStorage.setItem('usuarios', JSON.stringify([mockUser]));

        component.formLogin.get('email')?.setValue(mockUser.email);
        component.formLogin.get('password')?.setValue(mockUser.password);

        component.login();

        const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');

        // 1. Validamos la sesión
        expect(sesion.logueado).toBe(true);
        expect(sesion.usuario).toBe('juanito');

        // 2. Validamos la redirección a /perfil
        expect(assignSpy).toHaveBeenCalledWith('/perfil'); 
    });

    // ======================================================================
    // TEST 4: Login Exitoso (Administrador)
    // ======================================================================
    it('debería redirigir al administrador a /admin', () => {
        localStorage.setItem('usuarios', JSON.stringify([mockAdmin]));

        component.formLogin.get('email')?.setValue(mockAdmin.email);
        component.formLogin.get('password')?.setValue(mockAdmin.password);

        component.login();

        // Validamos la redirección a /admin
        expect(assignSpy).toHaveBeenCalledWith('/panel'); 
    });
});