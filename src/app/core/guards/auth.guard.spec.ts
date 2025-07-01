import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService, UserSession } from '../services/auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authServiceMock: any;
  let router: Router;

  beforeEach(() => {
    // FIX: El mock ahora define currentUserValue como un getter
    authServiceMock = {
      get currentUserValue(): UserSession | null {
        return null;
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  // Prueba para permitir el acceso a un usuario logueado
  it('debería permitir el acceso si hay una sesión activa', () => {
    // 1. Arrange: Simulamos una sesión de usuario normal
    spyOnProperty(authServiceMock, 'currentUserValue', 'get').and.returnValue({
      logueado: true,
      correo: 'user@test.com',
      tipo: 'usuario'
    });

    // 2. Act & 3. Assert: Ejecutamos el guard y esperamos que devuelva true
    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  // Prueba para denegar el acceso a un visitante
  it('debería denegar el acceso y redirigir a login si no hay sesión', () => {
    // 1. Arrange: Aseguramos que no hay sesión
    spyOnProperty(authServiceMock, 'currentUserValue', 'get').and.returnValue(null);

    // 2. Act & 3. Assert: Ejecutamos el guard y esperamos que devuelva false
    expect(executeGuard({} as any, {} as any)).toBe(false);
    // Verificamos que se haya intentado redirigir al login
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
