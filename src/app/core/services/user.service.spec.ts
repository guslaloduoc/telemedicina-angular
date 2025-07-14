import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AuthService, User, UserSession } from './auth.service';
import { AdminService } from '../../features/admin/services/admin.service';
import { BehaviorSubject } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let authServiceMock: any;
  let adminServiceMock: any;
  let sessionSubject: BehaviorSubject<UserSession | null>;
  let usersSubject: BehaviorSubject<User[]>;

  const mockUsers: User[] = [
    { id: 1, nombre: 'Test User', email: 'test@user.com', tipo: 'usuario' },
    { id: 2, nombre: 'Admin User', email: 'admin@user.com', tipo: 'admin' }
  ];

  beforeEach(() => {
    sessionSubject = new BehaviorSubject<UserSession | null>(null);
    usersSubject = new BehaviorSubject<User[]>([]);

    authServiceMock = {
      currentUserSession$: sessionSubject.asObservable()
    };
    adminServiceMock = {
      users$: usersSubject.asObservable(),
      updateUser: jasmine.createSpy('updateUser') // Creamos un espía para el método updateUser
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: AdminService, useValue: adminServiceMock }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el perfil correcto cuando la sesión y los usuarios están disponibles', (done) => {
    sessionSubject.next({ logueado: true, correo: 'test@user.com', tipo: 'usuario' });
    usersSubject.next(mockUsers);

    service.getCurrentUserProfile().subscribe(profile => {
      expect(profile).toBeTruthy();
      expect(profile?.email).toBe('test@user.com');
      expect(profile?.nombre).toBe('Test User');
      done();
    });
  });

  it('debería devolver null si no hay sesión, incluso si hay usuarios', (done) => {
    sessionSubject.next(null);
    usersSubject.next(mockUsers);

    service.getCurrentUserProfile().subscribe(profile => {
      expect(profile).toBeNull();
      done();
    });
  });

  // FIX: La prueba ahora verifica que se llame al método correcto en el servicio dependiente.
  it('debería llamar a adminService.updateUser al actualizar el perfil', () => {
    // 1. Arrange: Datos del perfil a actualizar
    const updatedProfile: User = { id: 1, nombre: 'Updated Name', email: 'test@user.com', tipo: 'usuario' };

    // 2. Act: Llamamos al método
    service.updateUserProfile(updatedProfile);

    // 3. Assert: Verificamos que el espía en adminServiceMock.updateUser haya sido llamado con los datos correctos.
    expect(adminServiceMock.updateUser).toHaveBeenCalledWith(updatedProfile);
  });
});