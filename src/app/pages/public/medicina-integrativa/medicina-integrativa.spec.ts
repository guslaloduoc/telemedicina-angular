import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicinaIntegrativaComponent } from './medicina-integrativa.component';
import { CartService } from '../../../core/services/cart.service';
import { EspecialidadesService } from '../../../core/services/especialidades.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('MedicinaIntegrativaComponent', () => {
  let component: MedicinaIntegrativaComponent;
  let fixture: ComponentFixture<MedicinaIntegrativaComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockEspecialidadesService: jasmine.SpyObj<EspecialidadesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['addItem']);
    mockEspecialidadesService = jasmine.createSpyObj('EspecialidadesService', ['getDoctoresPorEspecialidad']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // Al ser standalone, basta con importarlo directamente
      imports: [MedicinaIntegrativaComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: EspecialidadesService, useValue: mockEspecialidadesService },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicinaIntegrativaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería llamar a getDoctoresPorEspecialidad y asignar especialistas$', () => {
      const doctoresMock = [
        { id: 1, nombre: 'Dr. A', descripcion: '', imagen: '', servicio: 'X' }
      ];
      mockEspecialidadesService.getDoctoresPorEspecialidad.and.returnValue(of(doctoresMock));

      component.ngOnInit();

      let resultado: any;
      component.especialistas$.subscribe(value => resultado = value);

      expect(mockEspecialidadesService.getDoctoresPorEspecialidad)
        .toHaveBeenCalledWith('medicina-integrativa');
      expect(resultado).toEqual(doctoresMock);
    });
  });

  describe('agendarHora', () => {
    it('debería mostrar mensaje de éxito y limpiarlo tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: true, message: '¡Agendado!' });

      component.agendarHora('serv');
      expect(component.mensaje).toEqual({ tipo: 'exito', texto: '¡Agendado!' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));

    it('debería redirigir a login si el mensaje incluye "iniciar sesión"', () => {
      const errorMsg = 'Debe iniciar sesión para continuar';
      mockCartService.addItem.and.returnValue({ success: false, message: errorMsg });

      component.agendarHora('serv');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.mensaje).toBeNull();
    });

    it('debería mostrar mensaje de error genérico y limpiarlo tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: false, message: 'Error genérico' });

      component.agendarHora('serv');
      expect(component.mensaje).toEqual({ tipo: 'error', texto: 'Error genérico' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));
  });
});
