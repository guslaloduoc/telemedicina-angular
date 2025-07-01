import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { adminGuard } from './admin.guard';
import { AuthService, UserSession } from '../services/auth.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let authServiceMock: any;

  beforeEach(() => {
    // Creamos un mock del servicio con un getter para controlar el valor de la sesión
    authServiceMock = {
      get currentUserValue(): UserSession | null {
        return null;
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  // Prueba para permitir el acceso a un admin
  it('debería permitir el acceso si el usuario es admin', () => {
    // 1. Arrange: Simulamos que hay una sesión de admin activa
    spyOnProperty(authServiceMock, 'currentUserValue', 'get').and.returnValue({
      logueado: true,
      correo: 'admin@test.com',
      tipo: 'admin'
    });

    // 2. Act & 3. Assert: Ejecutamos el guard y esperamos que devuelva true
    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  // Prueba para denegar el acceso a un usuario normal
  it('debería denegar el acceso si el usuario no es admin', () => {
    // 1. Arrange: Simulamos una sesión de usuario normal
    spyOnProperty(authServiceMock, 'currentUserValue', 'get').and.returnValue({
      logueado: true,
      correo: 'user@test.com',
      tipo: 'usuario'
    });

    // 2. Act & 3. Assert: Ejecutamos el guard y esperamos que devuelva false
    expect(executeGuard({} as any, {} as any)).toBe(false);
  });
});
