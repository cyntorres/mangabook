import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @name Services
 * @description
 * **Servicio Principal de Autenticación.** Maneja el estado de la sesión, la gestión de usuarios
 * (registro/login) y el control de roles (admin/usuario). Es fundamental para proteger las rutas
 * y actualizar la barra de navegación.
 */
@Injectable({
  providedIn: 'root'
})
export class Services {

  /**
   * @property sesionSubject
   * @description
   * Fuente de datos que guarda y emite el estado actual del usuario logueado.
   * Es la base para la reactividad de la app.
   * @private
   */
  private sesionSubject = new BehaviorSubject<any>(this.getSesion());

  /**
   * @property sesion$
   * @description
   * Canal público (Observable) para que los componentes se suscriban y reaccionen
   * a cambios de login o logout en tiempo real.
   */
  sesion$ = this.sesionSubject.asObservable();

  /**
   * @constructor
   * @description
   * Se ejecuta al iniciar la aplicación. Verifica si existe la lista 'usuarios' en LocalStorage.
   * Si no existe, crea un usuario Administrador por defecto (`admin@duoc.cl`) para el testing inicial.
   */
  constructor() {
    const usuariosStr = localStorage.getItem('usuarios');
    if (!usuariosStr) {
      const admin = {
        nombre: 'Admin',
        email: 'admin@duoc.cl',
        password: 'admin',
        tipo: 'admin'
      };
      localStorage.setItem('usuarios', JSON.stringify([admin]));
    }
  }


  /**
   * @method getSesion
   * @description
   * Trae la información del usuario desde LocalStorage (si existe). Es una lectura directa.
   * @returns {any | null} Los datos del usuario actual o null si no hay nadie logueado.
   */
  getSesion() {
    const sesion = localStorage.getItem('sesion');
    return sesion ? JSON.parse(sesion) : null;
  }

  /**
   * @method estaLogueado
   * @description
   * Chequea rápidamente si la propiedad 'logueado' está activa en la sesión.
   * @returns {boolean} True si hay un usuario activo.
   */
  estaLogueado(): boolean {
    const sesion = this.getSesion();
    return sesion?.logueado || false;
  }

  /**
   * @method esAdmin
   * @description
   * Chequea si el usuario logueado actualmente es un administrador. Usado para restricciones en el Panel.
   * @returns {boolean} True si el rol es 'admin'.
   */
  esAdmin(): boolean {
    const sesion = this.getSesion();
    return sesion?.tipo === 'admin';
  }

  /**
   * @method cerrarSesion
   * @description
   * Elimina el ítem 'sesion' de LocalStorage y notifica a la app (vía sesion$) que el usuario salió.
   */
  cerrarSesion(): void {
    localStorage.removeItem('sesion');
    this.sesionSubject.next(null); // 🔁 actualiza para los suscriptores
  }

  /**
   * @method iniciarSesion
   * @description
   * Guarda la información del login exitoso en LocalStorage y notifica inmediatamente a todos los componentes.
   * @param {any} sesionData - Objeto con los datos del usuario logueado.
   */
  iniciarSesion(sesionData: any): void {
    localStorage.setItem('sesion', JSON.stringify(sesionData));
    this.sesionSubject.next(sesionData); // 🔁 notifica cambios
  }

  /**
   * @method addUser
   * @description
   * Agrega un nuevo usuario a la lista principal ('usuarios') si el email no está en uso. Usado en el Registro.
   * @param {any} user - Objeto del nuevo usuario a registrar.
   * @returns {boolean} True si se registró con éxito, false si el email ya existía.
   */
  addUser(user: any): boolean {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.some((u: any) => u.email === user.email);
    if (existe) return false;
    usuarios.push(user);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return true;
  }

}