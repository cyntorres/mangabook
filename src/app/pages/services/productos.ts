import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class Productos {
  private url = 'https://cyntorres.github.io/api-productos/productos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de productos precargados desde GitHub Pages.
   * @returns Observable<Producto[]>
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }
}
