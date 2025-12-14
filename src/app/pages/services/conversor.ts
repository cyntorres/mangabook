// Importa el decorador Injectable. Esto es OBLIGATORIO para que Angular
// sepa que esta clase es un servicio y pueda inyectarse en otros componentes.
import { Injectable } from '@angular/core';

// Importa el módulo principal para hacer peticiones HTTP (GET, POST, etc.).
// Esta es la herramienta que usaremos para comunicarnos con la API externa.
import { HttpClient } from '@angular/common/http';

// Importa Observable de RxJS. En Angular, las peticiones asíncronas
// (como las HTTP) NO devuelven datos inmediatamente, sino un Observable.
// Este objeto representa el flujo de datos que llegará en el futuro.
import { Observable } from 'rxjs';

// El decorador Injectable con configuración.
@Injectable({
  // 'providedIn: 'root'' le dice a Angular que este servicio debe ser
  // un Singleton (una única instancia) disponible para TODA la aplicación.
  // Es la forma más moderna de registrar un servicio globalmente.
  providedIn: 'root',
})
// La clase del servicio, renombrada a 'Conversor'.
export class Conversor {

  // URL de API GUARDADA EN LA VARIABLE APIURL
  // Variable privada que almacena la dirección web (endpoint) de la API.
  // Es una buena práctica guardarla aquí para poder cambiarla fácilmente.
  private apiURL = 'https://mindicador.cl/api/dolar';

  // METODO CONTRUCTOR ¿PARA QUE? ¿INSTANCIAR EL HTTP CLIENT?
  // ¡Sí, exactamente! Esta es la Inyección de Dependencias (DI):
  constructor(private http: HttpClient) { 
    // Al definir `private http: HttpClient` en el constructor,
    // Angular ve el tipo `HttpClient` y automáticamente busca y
    // provee (inyecta) una instancia lista para usarse.
    // Esto evita que tengas que crear (`new HttpClient()`) manualmente.
    // La variable `http` queda disponible dentro de la clase para hacer peticiones.
  }

  /**
   * Obtiene el valor del dólar mediante una API real (GET).
   * @returns Observable con la información del dólar.
   */
  // Método público que los componentes llamarán.
  getDolar(): Observable<any> {
    // Llama al método GET del HttpClient, pasándole la URL.
    // <any> indica el tipo de dato que esperamos (el objeto JSON de la API).
    // El método devuelve un Observable, que el componente debe "suscribir"
    // para procesar la respuesta cuando llegue.
    return this.http.get<any>(this.apiURL);
  }
}