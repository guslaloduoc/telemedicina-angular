import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AuthService, User, UserSession } from './auth.service';
import { of } from 'rxjs';

// FIX: Mock del AuthService ahora incluye la propiedad que vamos a espiar
const authServiceMock = {
  get currentUserValue(): UserSession | null {
    return null;
  }
};

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;

  const mockUsers: User[] = [
    { nombre: 'Test User', email: 'test@user.com', tipo: 'usuario', password: '123' },
    { nombre: 'Admin User', email: 'admin@user.com', tipo: 'admin', password: '456' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    localStorage.clear();
    localStorage.setItem('usuarios', JSON.stringify(mockUsers));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Prueba para la obtención del perfil
  it('debería obtener el perfil correcto del usuario logueado', (done) => {
    // 1. Arrange: Simulamos una sesión activa usando un spy en la propiedad de solo lectura
    spyOnProperty(authService, 'currentUserValue', 'get').and.returnValue({ 
      logueado: true, 
      correo: 'test@user.com', 
      tipo: 'usuario' 
    });

    // 2. Act: Llamamos al método
    service.getCurrentUserProfile().subscribe(profile => {
      // 3. Assert: Verificamos que el perfil devuelto sea el correcto
      expect(profile).toBeTruthy();
      expect(profile?.email).toBe('test@user.com');
      expect(profile?.nombre).toBe('Test User');
      done(); // Indicamos que la prueba asíncrona ha terminado
    });
  });

  // Prueba para la actualización del perfil
  it('debería actualizar los datos de un usuario en localStorage', () => {
    // 1. Arrange: Datos actualizados
    const updatedProfile: User = {
      nombre: 'Updated Name',
      usuario: 'updateduser',
      email: 'test@user.com', // El email no cambia
      tipo: 'usuario'
    };

    // 2. Act: Ejecutamos la actualización
    const resultado = service.updateUserProfile(updatedProfile);

    // 3. Assert: Verificamos el resultado
    expect(resultado).toBe(true);
    const usersFromStorage = JSON.parse(localStorage.getItem('usuarios')!);
    const userFromStorage = usersFromStorage.find((u: User) => u.email === 'test@user.com');
    expect(userFromStorage.nombre).toBe('Updated Name');
    expect(userFromStorage.usuario).toBe('updateduser');
    // Verificamos que la contraseña no se haya borrado
    expect(userFromStorage.password).toBe('123');
  });
});
