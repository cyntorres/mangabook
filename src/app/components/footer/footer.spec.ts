import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { Conversor } from '../../pages/services/conversor';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';

describe('Footer Component', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  
  // Creamos un mock del servicio Conversor
  const conversorMock = {
    getDolar: () => of({
      serie: [{ valor: 900, fecha: '2023-12-21T00:00:00.000Z' }]
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos RouterModule.forRoot([]) para que no falle la inyección de Router
      imports: [Footer, RouterModule.forRoot([])], 
      providers: [
        { provide: Conversor, useValue: conversorMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar el valor del dólar al iniciar', () => {
    // Al iniciar, el componente llama a cargarDolar()
    expect(component.dolarValor).toBe(900);
    expect(component.fecha).toBe('2023-12-21');
  });

  it('debe renderizar el valor del dólar en el HTML', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Buscamos si el valor 900 aparece en algún texto del footer
    expect(compiled.textContent).toContain('900');
  });
});