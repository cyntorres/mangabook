import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { Conversor } from '../../pages/services/conversor';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {

  constructor(
    private router: Router, // Inyección del servicio Router
    private conversor: Conversor // Inyección del servicio Conversor
  ) { }

  dolarValor: number | null = null;
  fecha: string | null = null;

  ngOnInit(): void {
    this.cargarDolar();
  }

  cargarDolar(): void {
    this.conversor.getDolar().subscribe({
      next: (data) => {
        if (data?.serie && data.serie.length > 0) {
          this.dolarValor = data.serie[0].valor;
          this.fecha = data.serie[0].fecha.substring(0, 10); // YYYY-MM-DD
        }
      },
      error: (err) => {
        console.error('Error cargando dólar:', err);
      }
    });
  }
}
