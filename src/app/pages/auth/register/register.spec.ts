import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Incluimos tanto register como checkEmailExists para evitar errores en el async validator
    mockAuthService = jasmine.createSpyObj('AuthService', ['register', 'checkEmailExists']);
    mockAuthService.checkEmailExists.and.returnValue(of(false));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],  // componente standalone incluye ReactiveFormsModule y RouterModule
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe inicializar registerForm con todos los controles', () => {
    component.ngOnInit();
    const controls = component.registerForm.controls;

    expect(controls['nombre']).toBeDefined();
    expect(controls['usuario']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['fechaNacimiento']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['confirmarPassword']).toBeDefined();
    expect(controls['comentarios']).toBeDefined();
  });

  it('onSubmit no debe llamar a AuthService.register si el formulario es inválido', () => {
    component.ngOnInit();
    spyOn(component.registerForm, 'markAllAsTouched');
    component.onSubmit();

    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('onSubmit válido debe llamar a register, mostrar éxito y redirigir tras 2s', fakeAsync(() => {
    component.ngOnInit();
    component.registerForm.setValue({
      nombre: 'Usuario',
      usuario: 'user123',
      email: 'a@b.com',
      fechaNacimiento: '1990-01-01',
      password: 'Abc12345',
      confirmarPassword: 'Abc12345',
      comentarios: ''
    });
    mockAuthService.register.and.returnValue(of(true));

    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nombre: 'Usuario',
        usuario: 'user123',
        email: 'a@b.com',
        fechaNacimiento: '1990-01-01',
        password: 'Abc12345',
        comentarios: ''
      })
    );
    expect(component.registroExitoso).toBeTrue();

    tick(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('onSubmit registro fallido debe marcar error en email y no redirigir', fakeAsync(() => {
    component.ngOnInit();
    component.registerForm.setValue({
      nombre: 'Usuario',
      usuario: 'user123',
      email: 'a@b.com',
      fechaNacimiento: '1990-01-01',
      password: 'Abc12345',
      confirmarPassword: 'Abc12345',
      comentarios: ''
    });
    mockAuthService.register.and.returnValue(of(false));

    component.onSubmit();
    expect(component.registerForm.get('email')?.hasError('emailExists')).toBeTrue();

    tick(2000);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});
