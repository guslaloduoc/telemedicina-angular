import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // 1. Importar environment

/**
 * @description
 * Interfaz que define la estructura de los datos de un doctor o especialista.
 * @internal
 */
interface Doctor {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

/**
 * @description
 * Interfaz que define la estructura de una especialidad, incluyendo sus doctores.
 */
export interface Especialidad {
  id: string;
  nombre: string;
  descripcion: string;
  doctores: Doctor[];
}

/**
 * @description
 * Servicio para obtener los datos de las especialidades y sus doctores desde la API.
 */
@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
   private apiUrl = `${environment.apiUrl}/especialidades`;

  constructor(private http: HttpClient) { }

  /**
   * @description
   * Obtiene la lista de doctores para una especialidad específica.
   * @param especialidadId El ID de la especialidad (ej. 'medicina-general').
   * @returns Un `Observable` que emite un array de `Doctor`.
   */
  getDoctoresPorEspecialidad(especialidadId: string): Observable<Doctor[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}?id=${especialidadId}`).pipe(
      map(especialidades => especialidades[0]?.doctores || []), // Devuelve los doctores de la primera especialidad encontrada, o un array vacío
      catchError(error => {
        console.error('Error al obtener los doctores:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}