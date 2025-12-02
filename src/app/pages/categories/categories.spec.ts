import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs'; // Necesario para simular la ruta
import { CommonModule } from '@angular/common';
import { vi } from 'vitest'; 

import { Categories } from './categories';

// Clave usada en el componente
const PRODUCTOS_ADMIN_KEY = 'productos_admin_list';

// ======================================================================
// MOCK de ActivatedRoute
// Usamos BehaviorSubject para poder cambiar el valor de 'params' en los tests
// ======================================================================
class MockActivatedRoute {
  // Inicializamos un BehaviorSubject para simular los parámetros de la ruta
  private paramsSubject = new BehaviorSubject<{ [key: string]: any }>({ nombre: 'MANGAS' });
  
  // La propiedad 'params' del Router se subscribe a este Subject
  public params = this.paramsSubject.asObservable();

  // Método para simular un cambio de ruta en el test
  public setParams(newParams: { [key: string]: any }) {
    this.paramsSubject.next(newParams);
  }
}


describe('Categories', () => {
    let component: Categories;
    let fixture: ComponentFixture<Categories>;
    let mockActivatedRoute: MockActivatedRoute;

    // Productos de prueba
    const mockProductos = [
        { id: 101, nombre: 'Z-Item', categoria: 'MANGAS', precio: 1000 },
        { id: 103, nombre: 'A-Item', categoria: 'MANGAS', precio: 3000 },
        { id: 102, nombre: 'B-Item', categoria: 'COMICS', precio: 2000 },
        { id: 104, nombre: 'C-Item', categoria: 'COMICS', precio: 4000 },
    ];

    beforeEach(async () => {
        mockActivatedRoute = new MockActivatedRoute();

        // 1. Configuración del TestBed
        await TestBed.configureTestingModule({
            imports: [CommonModule, Categories],
            providers: [
                // 2. Proporcionamos el Mock en lugar del servicio real de Angular
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        // 3. Inicialización del componente
        fixture = TestBed.createComponent(Categories);
        component = fixture.componentInstance;
    });

    // ----------------------------------------------------------------------
    // TEST 1: Creación y Estado Inicial
    // ----------------------------------------------------------------------
    it('debería crearse correctamente', () => {
        // Ejecutamos ngOnInit para cargar el estado inicial
        component.ngOnInit(); 
        expect(component).toBeTruthy();
    });

    // ----------------------------------------------------------------------
    // TEST 2: Filtrado por Categoría
    // ----------------------------------------------------------------------
    it('debería cargar y filtrar productos por la categoría de la ruta', () => {
        // Preparar localStorage
        localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(mockProductos));
        
        // Simular que la ruta es '/categorias/MANGAS'
        mockActivatedRoute.setParams({ nombre: 'MANGAS' });
        
        // Ejecutar ngOnInit para cargar los datos
        component.ngOnInit();
        
        // Verificar que solo haya 2 productos (los MANGAS)
        expect(component.productos.length).toBe(2);
        // Verificar que la categoría se haya establecido correctamente
        expect(component.categoria).toBe('MANGAS');
        // Verificar que los productos filtrados contengan el producto correcto
        expect(component.productos.some(p => p.nombre === 'Z-Item')).toBe(true);
    });

    // ----------------------------------------------------------------------
    // TEST 3: Inicialización de Orden
    // ----------------------------------------------------------------------
    it('debería ordenar inicialmente por nombre (criterio por defecto)', () => {
        // Preparar localStorage con los datos para el filtro
        localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(mockProductos));
        
        mockActivatedRoute.setParams({ nombre: 'MANGAS' });
        component.ngOnInit();
        
        // La ordenación por defecto ('nombre') debería dejar 'A-Item' primero y 'Z-Item' segundo
        expect(component.productos[0].nombre).toBe('A-Item');
        expect(component.productos[1].nombre).toBe('Z-Item');
        // El criterio debe ser 'nombre'
        expect(component.criterioActualClave).toBe('nombre');
    });

    // ----------------------------------------------------------------------
    // TEST 4: Ordenar por Título (nombre)
    // ----------------------------------------------------------------------
    it('debería ordenar los productos alfabéticamente por nombre', () => {
        // Usamos la lista de COMICS para probar la ordenación: B-Item, C-Item
        mockActivatedRoute.setParams({ nombre: 'COMICS' });
        localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(mockProductos));
        component.ngOnInit();

        // Ejecutar la ordenación específica (aunque ya es la de defecto, probamos la función)
        component.ordenarProductos('nombre'); 

        expect(component.productos[0].nombre).toBe('B-Item');
        expect(component.productos[1].nombre).toBe('C-Item');
        expect(component.criterioActualClave).toBe('nombre');
    });

    // ----------------------------------------------------------------------
    // TEST 5: Ordenar por Reciente (Mayor ID primero)
    // ----------------------------------------------------------------------
    it('debería ordenar por ID descendente (MÁS RECIENTE)', () => {
        localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(mockProductos));
        mockActivatedRoute.setParams({ nombre: 'MANGAS' });
        component.ngOnInit(); // Filtra y ordena inicialmente por nombre (A, Z)

        component.ordenarProductos('reciente'); // Debería ser Z(101) -> A(103)

        // Reciente = ID descendente. MANGAS son: Z-Item (101) y A-Item (103)
        expect(component.productos[0].id).toBe(103); 
        expect(component.productos[1].id).toBe(101);
        expect(component.criterioActualClave).toBe('reciente');
    });
    
    // ----------------------------------------------------------------------
    // TEST 6: Ordenar por Popular (Menor ID primero)
    // ----------------------------------------------------------------------
    it('debería ordenar por ID ascendente (MÁS ANTIGUO)', () => {
        localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(mockProductos));
        mockActivatedRoute.setParams({ nombre: 'MANGAS' });
        component.ngOnInit(); 

        component.ordenarProductos('popular'); // Debería ser Z(101) -> A(103)

        // Popular = ID ascendente. MANGAS son: Z-Item (101) y A-Item (103)
        expect(component.productos[0].id).toBe(101); 
        expect(component.productos[1].id).toBe(103);
        expect(component.criterioActualClave).toBe('popular');
    });
});