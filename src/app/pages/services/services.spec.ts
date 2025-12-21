import { TestBed } from '@angular/core/testing';
import { Services } from './services'; // Asegúrate de que la ruta sea correcta
import { firstValueFrom } from 'rxjs';

describe('Services (Autenticación)', () => {
  let service: Services;

  beforeEach(() => {
    // Limpiamos el localStorage antes de cada prueba para evitar interferencias
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [Services]
    });
    service = TestBed.inject(Services);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el servicio e inicializar el administrador por defecto', () => {
    expect(service).toBeTruthy();
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificamos que el admin creado en el constructor existe
    const admin = usuarios.find((u: any) => u.email === 'admin@duoc.cl');
    expect(admin).toBeDefined();
    expect(admin.nombre).toBe('Admin');
  });

  it('debe iniciar sesión y actualizar el estado observable', async () => {
    const datosSesion = { nombre: 'Test User', email: 'test@test.com', logueado: true, tipo: 'usuario' };
    
    // Ejecutamos la acción
    service.iniciarSesion(datosSesion);

    // Obtenemos el último valor del observable para verificarlo
    const sesionActual = await firstValueFrom(service.sesion$);
    
    expect(sesionActual).toEqual(datosSesion);
    expect(service.estaLogueado()).toBe(true); // Usamos toBe(true) que es más compatible
  });

  it('debe detectar correctamente si el usuario es admin', () => {
    const adminData = { email: 'admin@test.com', tipo: 'admin', logueado: true };
    service.iniciarSesion(adminData);
    
    expect(service.esAdmin()).toBe(true);
  });

  it('debe cerrar la sesión correctamente', async () => {
    const user = { email: 'user@test.com', logueado: true };
    service.iniciarSesion(user);
    
    service.cerrarSesion();
    
    const sesionFinal = await firstValueFrom(service.sesion$);
    expect(sesionFinal).toBeNull();
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('debe agregar un usuario nuevo si el email no existe', () => {
    const nuevoUsuario = { nombre: 'Nuevo', email: 'nuevo@test.com', password: '123' };
    
    const resultado = service.addUser(nuevoUsuario);
    
    expect(resultado).toBe(true);
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    expect(usuarios.length).toBe(2); // El admin por defecto + el nuevo
  });

  it('no debe permitir registrar un email que ya existe', () => {
    // 'admin@duoc.cl' ya fue creado por el constructor
    const usuarioDuplicado = { nombre: 'Otro', email: 'admin@duoc.cl', password: '456' };
    
    const resultado = service.addUser(usuarioDuplicado);
    
    expect(resultado).toBe(false);
  });
});