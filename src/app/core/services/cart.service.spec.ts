import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { AuthService, UserSession } from './auth.service';
import { of } from 'rxjs';

// Mock del AuthService
const authServiceMock = {
  // Usamos un BehaviorSubject simulado para controlar la sesión
  currentUserSession$: of<UserSession | null>(null) 
};

describe('CartService', () => {
  let service: CartService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Prueba para el caso en que el usuario no está logueado
  it('no debería agregar un item si el usuario no está logueado', () => {
    // 1. Arrange: Aseguramos que no hay sesión
    authService.currentUserSession$ = of(null);
    // Re-creamos el servicio para que se suscriba al nuevo estado del mock
    service = new CartService(authService); 

    // 2. Act: Intentamos agregar un item
    const resultado = service.addItem('Nuevo Servicio');

    // 3. Assert: Verificamos el resultado
    expect(resultado.success).toBe(false);
    expect(resultado.message).toContain('Debes iniciar sesión');
  });
});
