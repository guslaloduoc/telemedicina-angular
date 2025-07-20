/**
 * Configuración de entorno para desarrollo.
 *
 * Contiene los flags y URLs necesarias para ejecutar la aplicación
 * en modo no-productivo.
 *
 * @public
 */
export const environment = {
  /**
   * Indica si la aplicación está corriendo en modo producción.
   *
   * - `true`: optimiza bundles, activa minificación y deshabilita logs de depuración.
   * - `false`: habilita herramientas de depuración y hot‑reload.
   */
  production: false,

  /**
   * URL base para las llamadas HTTP a la API del backend.
   *
   * Debe terminar sin slash (`/`). Ejemplo:
   * ```ts
   * fetch(`${environment.apiUrl}/users`);
   * ```
   */
  apiUrl: 'http://localhost:3000'
};
