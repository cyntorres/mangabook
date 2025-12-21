import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Router, NavigationEnd, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  
  // Usamos un Subject para simular eventos del Router
  const routerEventsSubject = new Subject<any>();
  
  // Mock manual para evitar el error de 'jasmine' no encontrado
  const routerMock = {
    events: routerEventsSubject.asObservable(),
    navigate: () => Promise.resolve(true),
    serializeUrl: () => '',
    createUrlTree: () => ({}),
    routerState: { root: {} } // Esto soluciona el error "reading root" de tu imagen
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App, 
        Navbar, 
        Footer, 
        HttpClientTestingModule
      ],
      providers: [
        // Inyectamos nuestro mock en lugar del Router real
        { provide: Router, useValue: routerMock },
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear la aplicación', () => {
    expect(component).toBeTruthy();
  });

  it('debe ocultar el footer en login', () => {
    // Simulamos la navegación a login
    routerEventsSubject.next(new NavigationEnd(1, '/login', '/login'));
    
    // Usamos .toBe(false) que es estándar y no falla
    expect(component.showFooter).toBe(false);
  });
});