import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Productos, Producto } from './productos';
import { firstValueFrom } from 'rxjs';

describe('Productos Service', () => {
  let service: Productos;
  let httpMock: HttpTestingController;

  const mockProductos: Producto[] = [
    {
      id: 1,
      nombre: "MILES MORALES VOL.01",
      categoria: "Comics",
      precio: 25900,
      imagen: "assets/img/miles_morales.jpg",
      stock: 10
    },
    {
      id: 2,
      nombre: "SCARLET WITCH VOL.01",
      categoria: "Comics",
      precio: 11900,
      imagen: "assets/img/bruja 1.png",
      stock: 5
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Productos]
    });
    service = TestBed.inject(Productos);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener los productos correctamente', async () => {
    // 1. Preparamos la promesa
    const productosPromise = firstValueFrom(service.getProductos());

    // 2. Capturamos la petición pendiente
    const req = httpMock.expectOne('https://cyntorres.github.io/api-productos/productos.json');
    expect(req.request.method).toBe('GET');
    
    // 3. Respondemos con los datos
    req.flush(mockProductos);

    // 4. Esperamos el resultado y validamos
    const productos = await productosPromise;
    expect(productos.length).toBe(2);
    expect(productos[0].nombre).toBe('MILES MORALES VOL.01');
  });

  it('debe manejar errores 404', async () => {
    const productosPromise = firstValueFrom(service.getProductos());

    const req = httpMock.expectOne('https://cyntorres.github.io/api-productos/productos.json');
    req.flush('Error', { status: 404, statusText: 'Not Found' });

    try {
      await productosPromise;
      // Si llega aquí, es que no falló, lo cual es un error en este test
      throw new Error('Debería haber fallado');
    } catch (error: any) {
      expect(error.status).toBe(404);
    }
  });
});