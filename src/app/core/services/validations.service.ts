import { Injectable } from '@angular/core';

/**
 * @public
 * @description
 * Servicio para centralizar y reutilizar validaciones personalizadas
 * que se aplican en distintos formularios de la aplicación.
 *
 * Aquí puedes añadir métodos para validar patrones, rangos,
 * comparaciones entre campos, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  /**
   * Inicializa el servicio de validaciones.
   * Por defecto no requiere configuración adicional.
   */
  constructor() { }

  // Ejemplo de método de validación que podrías añadir:
  /**
   * @public
   * @description
   * Valida que un string contenga al menos una letra mayúscula,
   * una minúscula y un dígito, con longitud mínima de 8 caracteres.
   *
   * @param value El valor a validar.
   * @returns `true` si cumple el patrón, `false` en caso contrario.
   */
  // hasStrongPassword(value: string): boolean {
  //   const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  //   return pattern.test(value);
  // }
}
