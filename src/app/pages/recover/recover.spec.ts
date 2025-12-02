import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Asegurar que se importe
import { vi } from 'vitest'; 

import { Recover } from './recover';

describe('Recover', () => {
    let component: Recover;
    let fixture: ComponentFixture<Recover>;

    // Datos mock para simular un usuario en localStorage
    const mockUser = {
        nombre: 'Cynthia',
        email: 'cyn.torres.leal@gmail.com',
        password: 'ClaveSegura123',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            // ✅ CORRECCIÓN: Si Recover es standalone, debe ir en imports.
            imports: [CommonModule, ReactiveFormsModule, Recover]
            // Nota: Si Recover usara el Router, necesitaríamos provideRouter.
        }).compileComponents();

        fixture = TestBed.createComponent(Recover);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Inicializa el componente y el formulario
    });

    it('debería crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    // ======================================================================
    // TEST 1: Formulario Inválido
    // ======================================================================
    it('debería marcar el formulario como tocado y no continuar si está vacío', () => {
        // Aseguramos que el formulario empiece como prístino (sin tocar)
        expect(component.formRecover.pristine).toBe(true);
        
        // Llamamos a la función con el formulario vacío (inválido por Validators.required)
        component.recuperar();

        // Verificamos que el formulario fue marcado como tocado
        expect(component.formRecover.get('email')?.touched).toBe(true);
        // Verificamos que no se haya establecido ningún mensaje
        expect(component.mensaje).toBe('');
        expect(component.error).toBe('');
    });

    // ======================================================================
    // TEST 2: Usuario Inexistente
    // ======================================================================
    it('debería establecer un mensaje de error si el usuario no existe', () => {
        // 1. Preparamos el localStorage con una lista de usuarios (o vacía)
        localStorage.setItem('usuarios', JSON.stringify([mockUser]));

        // 2. Simulamos la entrada de un email que NO existe
        component.formRecover.get('email')?.setValue('otro@correo.cl');
        
        // 3. Ejecutamos la función
        component.recuperar();

        // 4. Verificamos que el mensaje de error se haya establecido correctamente
        expect(component.error).toBe('Usuario no encontrado con ese correo.');
        expect(component.mensaje).toBe('');
    });

    // ======================================================================
    // TEST 3: Recuperación Exitosa
    // ======================================================================
    it('debería mostrar la contraseña si el usuario es encontrado', () => {
        // 1. Preparamos el localStorage con el usuario de prueba
        localStorage.setItem('usuarios', JSON.stringify([mockUser]));

        // 2. Simulamos la entrada del email correcto
        component.formRecover.get('email')?.setValue(mockUser.email);
        
        // 3. Ejecutamos la función
        component.recuperar();

        // 4. Verificamos el mensaje de éxito
        const expectedMessage = `Hola ${mockUser.nombre}, tu contraseña es: ${mockUser.password}`;
        expect(component.mensaje).toBe(expectedMessage);
        expect(component.error).toBe('');
    });

    // ======================================================================
    // TEST 4: La función limpiar
    // ======================================================================
    it('debería resetear el formulario y los mensajes al limpiar', () => {
        // 1. Configuramos el estado con datos y errores (para simular uso)
        component.formRecover.get('email')?.setValue('datos@test.cl');
        component.error = 'Un error de prueba';
        component.mensaje = 'Un mensaje de prueba';

        // 2. Ejecutamos la función limpiar
        component.limpiar();

        // 3. Verificamos que los mensajes estén vacíos y el formulario reseteado
        expect(component.error).toBe('');
        expect(component.mensaje).toBe('');
        // Verificamos que el valor del email sea nulo o vacío después del reset
        expect(component.formRecover.value.email).toBeNull(); 
    });
});