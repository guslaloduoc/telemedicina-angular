import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PsicologiaComponent } from './psicologia.component';
import { CartService } from '../../../core/services/cart.service';
import { EspecialidadesService } from '../../../core/services/especialidades.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('PsicologiaComponent', () => {
  let component: PsicologiaComponent;
  let fixture: ComponentFixture<PsicologiaComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockEspecialidadesService: jasmine.SpyObj<EspecialidadesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['addItem']);
    mockEspecialidadesService = jasmine.createSpyObj('EspecialidadesService', ['getDoctoresPorEspecialidad']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PsicologiaComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: EspecialidadesService, useValue: mockEspecialidadesService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PsicologiaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debe solicitar los psicólogos y asignar psicologos$', () => {
      const psicologosMock = [
        { id: 1, nombre: 'Dra. X', descripcion: '', imagen: '', servicio: 'Terapia' }
      ];
      mockEspecialidadesService.getDoctoresPorEspecialidad.and.returnValue(of(psicologosMock));

      component.ngOnInit();

      let resultado: any;
      component.psicologos$.subscribe(value => resultado = value);

      expect(mockEspecialidadesService.getDoctoresPorEspecialidad)
        .toHaveBeenCalledWith('psicologia');
      expect(resultado).toEqual(psicologosMock);
    });
  });

  describe('agendarHora', () => {
    it('muestra mensaje de éxito y lo limpia tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: true, message: '¡Agendado correctamente!' });

      component.agendarHora('Terapia');
      expect(component.mensaje).toEqual({ tipo: 'exito', texto: '¡Agendado correctamente!' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));

    it('redirige a login si el mensaje incluye "iniciar sesión"', () => {
      const errorMsg = 'Debe iniciar sesión para continuar';
      mockCartService.addItem.and.returnValue({ success: false, message: errorMsg });

      component.agendarHora('Terapia');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.mensaje).toBeNull();
    });

    it('muestra mensaje de error genérico y lo limpia tras 3s', fakeAsync(() => {
      mockCartService.addItem.and.returnValue({ success: false, message: 'Error inesperado' });

      component.agendarHora('Terapia');
      expect(component.mensaje).toEqual({ tipo: 'error', texto: 'Error inesperado' });

      tick(3000);
      expect(component.mensaje).toBeNull();
    }));
  });
});
