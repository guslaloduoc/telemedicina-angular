import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['recoverPassword']);

    await TestBed.configureTestingModule({
      imports: [
        RecoverPasswordComponent,   // standalone component
        RouterTestingModule        // provee Router, ActivatedRoute, etc.
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;

    // Obtenemos el router real del TestingModule y espiamos navigate()
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit inicializa controles y validador de coincidencia', () => {
    component.ngOnInit();
    const controls = component.recoverForm.controls;

    expect(controls['email']).toBeDefined();
    expect(controls['nuevaPassword']).toBeDefined();
    expect(controls['confirmarPassword']).toBeDefined();

    // contraseña y confirmación distintos → error passwordMismatch
    controls['nuevaPassword'].setValue('abc');
    controls['confirmarPassword'].setValue('def');
    component.recoverForm.updateValueAndValidity();
    expect(component.recoverForm.errors?.['passwordMismatch']).toBeTrue();

    // misma contraseña → sin errores
    controls['confirmarPassword'].setValue('abc');
    component.recoverForm.updateValueAndValidity();
    expect(component.recoverForm.errors).toBeNull();
  });

  it('onSubmit inválido NO llama a recoverPassword', () => {
    component.ngOnInit();
    spyOn(component.recoverForm, 'markAllAsTouched');
    component.onSubmit();

    expect(component.recoverForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockAuthService.recoverPassword).not.toHaveBeenCalled();
  });

  it('onSubmit válido CON ÉXITO llama a recoverPassword, muestra mensaje y navega tras 2.5s', fakeAsync(() => {
    component.ngOnInit();
    component.recoverForm.setValue({
      email: 'test@example.com',
      nuevaPassword: 'Abcdef12',
      confirmarPassword: 'Abcdef12'
    });
    mockAuthService.recoverPassword.and.returnValue(true);

    component.onSubmit();

    expect(mockAuthService.recoverPassword)
      .toHaveBeenCalledWith('test@example.com', 'Abcdef12');
    expect(component.mensaje).toEqual({
      tipo: 'exito',
      texto: 'Contraseña actualizada exitosamente ✅'
    });

    tick(2500);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('onSubmit válido CON FALLO muestra mensaje de error y NO navega', () => {
    component.ngOnInit();
    component.recoverForm.setValue({
      email: 'test@example.com',
      nuevaPassword: 'Abcdef12',
      confirmarPassword: 'Abcdef12'
    });
    mockAuthService.recoverPassword.and.returnValue(false);

    component.onSubmit();

    expect(component.mensaje).toEqual({
      tipo: 'error',
      texto: 'No se encontró un usuario con ese correo.'
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
