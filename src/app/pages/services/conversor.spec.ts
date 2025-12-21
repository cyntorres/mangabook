import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Conversor } from './conversor'; // Ajusta la ruta a tu archivo
import { firstValueFrom } from 'rxjs';

describe('Conversor Service', () => {
  let service: Conversor;
  let httpMock: HttpTestingController;

  // Definimos un objeto que imite la estructura real de la API de mindicador
  const mockDolarResponse = {
    version: '1.7.0',
    autor: 'mindicador.cl',
    codigo: 'dolar',
    nombre: 'Dólar observado',
    unidad_medida: 'Pesos',
    serie: [
      {
        fecha: '2023-10-27T03:00:00.000Z',
        valor: 920.5
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Conversor]
    });

    service = TestBed.inject(Conversor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no haya peticiones colgadas
    httpMock.verify();
  });

  it('debe ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener los datos del dólar (GET)', async () => {
    // 1. Iniciamos la llamada al servicio
    const obs$ = service.getDolar();
    
    // 2. Convertimos el observable a promesa para usar await (evita errores de done)
    const promesaDolar = firstValueFrom(obs$);

    // 3. Verificamos que se haya intentado llamar a la URL correcta
    const req = httpMock.expectOne('https://mindicador.cl/api/dolar');
    expect(req.request.method).toBe('GET');

    // 4. Respondemos con nuestros datos de prueba (mock)
    req.flush(mockDolarResponse);

    // 5. Esperamos el resultado y validamos los datos
    const data = await promesaDolar;
    expect(data.codigo).toBe('dolar');
    expect(data.serie[0].valor).toBe(920.5);
    expect(data.nombre).toContain('Dólar');
  });

  it('debe manejar un error de red o API (404)', async () => {
    const obs$ = service.getDolar();
    const promesaDolar = firstValueFrom(obs$);

    const req = httpMock.expectOne('https://mindicador.cl/api/dolar');
    
    // Simulamos un error del servidor
    req.flush('Error de API', { status: 404, statusText: 'Not Found' });

    try {
      await promesaDolar;
      // Si llega aquí, el test falló porque no detectó el error
      throw new Error('Debería haber fallado con 404');
    } catch (error: any) {
      // Verificamos que el error sea el esperado
      expect(error.status).toBe(404);
    }
  });
});