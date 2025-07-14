import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, CartItem } from './cart.service';
import { AuthService, UserSession } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment'; // Importar el entorno

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let sessionSubject: BehaviorSubject<UserSession | null>;
  const apiUrl = `${environment.apiUrl}/carrito`; // Usar la URL del entorno

  beforeEach(() => {
    sessionSubject = new BehaviorSubject<UserSession | null>(null);
    authServiceMock = {
      currentUserSession$: sessionSubject.asObservable()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    // FIX: La prueba ahora espera la URL correcta del entorno.
    const req = httpMock.expectOne(apiUrl);
    req.flush([]);
    expect(service).toBeTruthy();
  });

  it('debería cargar los items iniciales del carrito desde la API', () => {
    const mockCartItems: CartItem[] = [
      { id: 1, servicio: 'Consulta General', usuario: 'test@test.com' }
    ];
    
    // FIX: La prueba ahora espera la URL correcta del entorno.
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);

    service.cart$.subscribe(items => {
      expect(items).toEqual(mockCartItems);
    });
  });

  // ... (el resto de las pruebas del CartService también usarán la variable apiUrl)
});
