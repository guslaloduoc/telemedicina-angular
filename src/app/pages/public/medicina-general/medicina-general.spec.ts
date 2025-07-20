import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicinaGeneralComponent } from './medicina-general.component';
import { CartService } from '../../../core/services/cart.service';
import { EspecialidadesService } from '../../../core/services/especialidades.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('MedicinaGeneralComponent', () => {
  let component: MedicinaGeneralComponent;
  let fixture: ComponentFixture<MedicinaGeneralComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockEspecialidadesService: jasmine.SpyObj<EspecialidadesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['addItem']);
    mockEspecialidadesService = jasmine.createSpyObj('EspecialidadesService', ['getDoctoresPorEspecialidad']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MedicinaGeneralComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: EspecialidadesService, useValue: mockEspecialidadesService },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicinaGeneralComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería llamar a getDoctoresPorEspecialidad y asignar doctores$', () => {
      const doctoresMock = [
        { id: 1, nombre: 'Dr. X', descripcion: '', imagen: '', servicio: 'Consulta' }
      ];
      mockEspecialidadesService.getDoctoresPorEspecialidad.and.returnValue(of(doctoresMock));

      component.ngOnInit();

      let resultado: any;
      component.doctores$.subscribe(value => resultado = value);

      expect(mockEspecialidadesService.getDoctoresPorEspecialidad)
        .toHaveBeenCalledWith('medicina-general');
      expect(resultado).toEqual(doctoresMock);
    });
  });

  describe('agendarHora', () => {
    it('debería mostrar mensaje de éxito y limpiarlo tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: true, message: '¡Agendado correctamente!' });

      component.agendarHora('Consulta');
      expect(component.mensaje).toEqual({ tipo: 'exito', texto: '¡Agendado correctamente!' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));

    it('debería redirigir a login si el mensaje incluye "iniciar sesión"', () => {
      const errorMsg = 'Por favor iniciar sesión';
      mockCartService.addItem.and.returnValue({ success: false, message: errorMsg });

      component.agendarHora('Consulta');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.mensaje).toBeNull();
    });

    it('debería mostrar mensaje de error genérico y limpiarlo tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: false, message: 'Error inesperado' });

      component.agendarHora('Consulta');
      expect(component.mensaje).toEqual({ tipo: 'error', texto: 'Error inesperado' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));
  });
});
