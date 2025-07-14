import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EspecialidadesService, Especialidad } from './especialidades.service';
import { environment } from '../../../environments/environment';

describe('EspecialidadesService', () => {
  let service: EspecialidadesService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/especialidades`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EspecialidadesService]
    });
    service = TestBed.inject(EspecialidadesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los doctores para una especialidad específica', (done) => {
    const mockEspecialidad: Especialidad[] = [
      {
        id: 'medicina-general',
        nombre: 'Medicina General',
        descripcion: '...',
        doctores: [
          { id: 101, nombre: 'Dr. Juan Pérez', descripcion: '...', imagen: '...', servicio: '...' }
        ]
      }
    ];
    const especialidadId = 'medicina-general';

    service.getDoctoresPorEspecialidad(especialidadId).subscribe(doctores => {
      expect(doctores.length).toBe(1);
      expect(doctores[0].nombre).toBe('Dr. Juan Pérez');
      done();
    });

    // FIX: La prueba ahora espera la URL correcta del entorno.
    const req = httpMock.expectOne(`${apiUrl}?id=${especialidadId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEspecialidad);
  });
});
