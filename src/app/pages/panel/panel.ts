import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

/**
 * @interface Producto
 * @description
 * Define la estructura de datos que debe tener cada producto en el inventario.
 */
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  stock: number;
}

const PRODUCTOS_PANEL_KEY = 'productos_admin_list';

/**
 * @component Panel
 * @description
 * Componente principal para la gestión del inventario (CRUD). Permite al administrador
 * agregar, editar, eliminar y visualizar productos utilizando LocalStorage para la persistencia.
 */
@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})

export class Panel implements OnInit {

  products: Producto[] = [];
  newProduct: Producto = this.getEmptyProduct();
  isEditMode: boolean = false;

  constructor() { }

  /**
   * @method ngOnInit
   * @description
   * Hook de inicialización del componente. Carga la lista de productos almacenados
   * en LocalStorage al inicio.
   */
  ngOnInit(): void {
    this.loadProductsFromStorage();
  }

  /**
   * @method loadProductsFromStorage
   * @description
   * Recupera el arreglo de productos desde LocalStorage y lo asigna a la propiedad 'products'.
   * Si no existe data, carga datos iniciales.
   * @private
   */
  private loadProductsFromStorage(): void {
    const data = localStorage.getItem(PRODUCTOS_PANEL_KEY);
    this.products = data ? JSON.parse(data) : this.initialData();
  }

  /**
   * @method saveProductsToStorage
   * @description
   * Guarda el arreglo actual de productos ('this.products') en LocalStorage.
   * Se llama después de cada operación de CRUD (agregar, editar, eliminar).
   * @private
   */
  private saveProductsToStorage(): void {
    localStorage.setItem(PRODUCTOS_PANEL_KEY, JSON.stringify(this.products));
  }

  /**
   * @method getEmptyProduct
   * @description
   * Genera una instancia vacía del objeto Producto para resetear el formulario.
   * @returns {Producto} Un objeto Producto con valores por defecto.
   * @private
   */
  private getEmptyProduct(): Producto {
    return { id: 0, nombre: '', categoria: '', precio: 0, imagen: '', stock: 0 };
  }

  /**
   * @method getNextId
   * @description
   * Calcula el siguiente ID disponible buscando el máximo ID actual en la lista y sumándole 1.
   * @returns {number} El nuevo ID único.
   * @private
   */
  private getNextId(): number {
    const maxId = this.products.length > 0
      ? Math.max(...this.products.map(p => p.id))
      : 0;
    return maxId + 1;
  }

  /**
   * @method initialData
   * @description
   * Proporciona un conjunto inicial de productos si LocalStorage está vacío.
   * @returns {Producto[]} Un arreglo de productos iniciales.
   * @private
   */
  private initialData(): Producto[] {
    return [
      { id: 1, nombre: 'MILES MORALES VOL.01', categoria: 'Comics', precio: 25900, imagen: 'assets/img/miles_morales.jpg', stock: 10 },
      { id: 2, nombre: 'SCARLET WITCH VOL.01', categoria: 'Comics', precio: 11900, imagen: 'assets/img/bruja 1.png', stock: 5 },
    ];
  }

  /**
   * @method onSubmit
   * @description
   * Maneja el envío del formulario. Llama a la lógica de edición o a la lógica de adición,
   * basándose en el estado de 'isEditMode'. Muestra alertas Swal de éxito.
   */
  onSubmit(): void {
    if (this.isEditMode) {

      //Busca el índice del producto original en el array usando el ID.
      const index = this.products.findIndex(p => p.id === this.newProduct.id);

      if (index !== -1) {
        //Reemplaza el producto antiguo con el objeto 'newProduct' editado.
        this.products[index] = this.newProduct;
      }

      //Guarda el nuevo estado en LocalStorage.
      this.saveProductsToStorage();

      //Reinicia el modo de edición y limpia el formulario.
      this.onCancelEdit(); // Reutilizamos la función para resetear el estado y el formulario
      this.isEditMode = false;

      Swal.fire({
        icon: 'success',
        title: '¡Cambios Guardados!',
        text: 'El producto ha sido actualizado exitosamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        timer: 5000,
        timerProgressBar: true
      });

    } else {
      this.newProduct.id = this.getNextId();
      this.products = [this.newProduct, ...this.products];
      this.saveProductsToStorage();

      Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `"El producto ${this.newProduct.nombre}" ha sido añadido a la lista.`,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        timer: 5000,
        timerProgressBar: true
      });

      this.newProduct = this.getEmptyProduct();
    }
  }

  /**
   * @method onEdit
   * @description
   * Prepara el formulario para la edición. Copia el producto seleccionado al objeto 'newProduct'
   * y activa el modo de edición.
   * @param {Producto} producto - El producto que se va a editar.
   */
  onEdit(producto: Producto): void {
    //Crea una COPIA del producto para evitar modificar el array original antes de Guardar.
    this.newProduct = { ...producto };

    //Activa el modo de edición.
    this.isEditMode = true;
  }

  /**
   * @method onCancelEdit
   * @description
   * Cancela la operación de edición, resetea el formulario y el modo de edición. Muestra una alerta informativa.
   */
  onCancelEdit(): void {
    //Apaga el modo de edición. Esto cambia el color/texto del encabezado y botón.
    this.isEditMode = false;

    //Limpia el objeto enlazado al formulario (newProduct).
    this.newProduct = this.getEmptyProduct();

    //Mostrar un mensaje de que la edición fue cancelada.
    Swal.fire({
      icon: 'info',
      title: '¡La edición fue cancelada!',
      text: 'El formulario ha sido restablecido.',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      timer: 5000,
      timerProgressBar: true
    });
  }

  /**
   * @method onDelete
   * @description
   * Muestra una alerta de confirmación antes de eliminar el producto. Si se confirma,
   * elimina el producto del array y actualiza LocalStorage.
   * @param {number} index - El índice del producto a eliminar en el array 'products'.
   */
  onDelete(index: number): void {
    const productoAEliminar = this.products[index];

    //Pide confirmación antes de eliminar
    Swal.fire({
      title: `¿Desea eliminar el producto "${productoAEliminar.nombre}"?`,
      text: "¡Esta acción es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Procede con la eliminación
        this.products.splice(index, 1);
        this.products = [...this.products]; // Forzar la detección de cambios
        this.saveProductsToStorage();

        //Muestra un mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          timer: 5000,
          timerProgressBar: true
        });
      }
    });
  }
}