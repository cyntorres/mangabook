import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// ⭐ CORRECCIÓN: Usamos solo una clave para la lista maestra (la que usa el Panel)
const PRODUCTOS_ADMIN_KEY = 'productos_admin_list';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  categoria = '';
  productos: any[] = []; // Contiene solo los productos de la categoría actual

  // Patrón Estado/Getter (para el botón de ordenación)
  criteriosMapeo: { [key: string]: string } = {
    'reciente': 'MÁS RECIENTE',
    'popular': 'MÁS ANTIGUO',
    'nombre': 'ORDENAR POR TÍTULO',
  };

  criterioActualClave: string = 'nombre';

  get criterioOrdenActual(): string {
    return this.criteriosMapeo[this.criterioActualClave] || 'Seleccionar Orden';
  }

  constructor(private route: ActivatedRoute) { }

  // --------------------------------------------------------------------------
  // LÓGICA DE LOCALSTORAGE Y CARGA
  // --------------------------------------------------------------------------

  // Obtiene TODOS los productos guardados por el Panel desde LocalStorage
  private cargarTodosLosProductosDelAdmin(): any[] {
    const productosString = localStorage.getItem(PRODUCTOS_ADMIN_KEY);
    return productosString ? JSON.parse(productosString) : [];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoria = params['nombre'];

      // Cargar y Filtrar (El nuevo flujo de datos)
      const todosLosProductos = this.cargarTodosLosProductosDelAdmin();

      // 1. FILTRAR: Asigna solo los productos de la categoría actual a 'this.productos'
      this.productos = todosLosProductos.filter((producto: any) => {
        return producto.categoria.toLowerCase() === this.categoria.toLowerCase();
      });

      // 2. Ordenar inicialmente por el criterio por defecto ('titulo')
      this.ordenarProductos(this.criterioActualClave);
    });
  }

  // --------------------------------------------------------------------------
  // LÓGICA DE ORDENAMIENTO
  // --------------------------------------------------------------------------

  ordenarProductos(criterio: string): void {

    // 1. Actualiza el estado del botón.
    this.criterioActualClave = criterio;

    // 2. Inmutabilidad: Crea una COPIA de los productos filtrados para ordenar.
    let productosOrdenados = [...this.productos];

    // 3. Ordena la COPIA (productosOrdenados)
    switch (criterio) {
      case 'reciente':
        productosOrdenados.sort((a, b) => b.id - a.id);
        break;

      case 'popular':
        productosOrdenados.sort((a, b) => a.id - b.id);
        break;

      case 'nombre':
        productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;

      default:
        break;
    }

    // 4. ⭐ CORRECCIÓN CRÍTICA: Aplica el array ORDENADO a 'this.productos'.
    // Esto genera el cambio de referencia que Angular necesita para actualizar la vista.
    this.productos = productosOrdenados;
  }
}