import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,         // standalone component
        RouterTestingModule     // suministra Router, ActivatedRoute, RouterLink, etc.
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit inicializa loginForm con email y password', () => {
    component.ngOnInit();
    const controls = component.loginForm.controls;
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
  });

  it('getter f devuelve los controles del formulario', () => {
    component.ngOnInit();
    expect(component.f).toBe(component.loginForm.controls);
  });

  it('onSubmit inválido NO llama a login', () => {
    component.ngOnInit();
    spyOn(component.loginForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('onSubmit válido CON ÉXITO llama a login y NO marca loginInvalido', fakeAsync(() => {
    component.ngOnInit();
    component.loginForm.setValue({
      email: 'u@e.com',
      password: 'password123'
    });
    mockAuthService.login.and.returnValue(of({
      logueado: true,
      correo: 'u@e.com',
      tipo: 'usuario'
    } as any));

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('u@e.com', 'password123');
    expect(component.loginInvalido).toBeFalse();
  }));

  it('onSubmit válido CON FALLO marca loginInvalido y loguea el error', fakeAsync(() => {
    component.ngOnInit();
    component.loginForm.setValue({
      email: 'u@e.com',
      password: 'wrong'
    });
    mockAuthService.login.and.returnValue(of(null));
    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('u@e.com', 'wrong');
    expect(component.loginInvalido).toBeTrue();
    expect(consoleErrorSpy)
      .toHaveBeenCalledWith('Login fallido: credenciales incorrectas.');
  }));
});
