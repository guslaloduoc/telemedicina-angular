import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description
 * Clase que contiene validadores personalizados y estáticos para ser utilizados
 * en formularios reactivos de Angular.
 */
export class CustomValidators {

  /**
   * @description
   * Validador que comprueba si la fecha de nacimiento corresponde a una edad mínima.
   * Es una función de orden superior (factory) que devuelve una función de validación.
   * @param edadMinima La edad mínima requerida que el usuario debe tener.
   * @returns Una función `ValidatorFn` que Angular puede utilizar para validar un control.
   */
  static edadMinima(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si no hay valor, no validamos (para eso está 'required')
      }

      const fechaNacimiento = new Date(control.value);
      const fechaLimite = new Date();
      fechaLimite.setFullYear(fechaLimite.getFullYear() - edadMinima);

      // Si la fecha de nacimiento es posterior a la fecha límite, significa que el usuario
      // no ha cumplido la edad mínima, por lo que se devuelve un objeto de error.
      return fechaNacimiento > fechaLimite ? { edadInsuficiente: true } : null;
    };
  }

  /**
   * @description
   * Validador a nivel de formulario que comprueba si dos campos de contraseña coinciden.
   * Debe aplicarse al `FormGroup` que contiene ambos controles de contraseña.
   * @param controlName El nombre del control del formulario para la contraseña principal.
   * @param matchingControlName El nombre del control del formulario para la confirmación de la contraseña.
   * @returns Una función `ValidatorFn` que Angular puede utilizar para validar un grupo de controles.
   */
  static passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(controlName);
      const confirmPasswordControl = formGroup.get(matchingControlName);

      // Si los controles no existen o no tienen valor, no se realiza la validación.
      if (!passwordControl || !confirmPasswordControl || !passwordControl.value || !confirmPasswordControl.value) {
        return null;
      }

      // Si el control de confirmación ya tiene un error que no es el de 'passwordMismatch',
      // no se sobrescribe ese error.
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }

      // Se comparan los valores. Si no coinciden, se establece un error en el control
      // de confirmación para poder mostrar un mensaje específico en ese campo.
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true }; // También se devuelve el error a nivel de grupo
      } else {
        confirmPasswordControl.setErrors(null); // Si coinciden, se limpia el error.
        return null;
      }
    };
  }
}
