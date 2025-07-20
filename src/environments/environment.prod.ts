/**
 * Configuración de entorno para producción.
 *
 * Contiene las opciones y URLs que la aplicación usará en un despliegue
 * productivo. Se activa al compilar con `ng build --prod`.
 *
 * @public
 */
export const environment = {
  /**
   * Flag que indica si la aplicación debe ejecutarse
   * en modo producción.
   *
   * - `true`: activa optimizaciones de bundles,
   *   minificación, tree‑shaking y deshabilita logs
   *   de depuración.
   */
  production: true,

  /**
   * URL base para las llamadas HTTP a la API del backend
   * en producción.
   *
   * Debe incluir el protocolo y no terminar en `/`.
   * Ejemplo de uso:
   * ```ts
   * this.http.get(`${environment.apiUrl}/users`);
   * ```
   */
  apiUrl: 'http://api'
};