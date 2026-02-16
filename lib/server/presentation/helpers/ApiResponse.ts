/** Centralized API response formatter */

export interface ApiResponseFormat<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

export class ApiResponse {
  /**
   * Respuesta exitosa
   */
  static success<T>(data: T): ApiResponseFormat<T> {
    return {
      success: true,
      data,
    };
  }

  /**
   * Error único
   */
  static error(error: string): ApiResponseFormat<never> {
    return {
      success: false,
      error,
      errors: [error],
    };
  }

  /**
   * Múltiples errores de validación
   */
  static validationErrors(errors: string[]): ApiResponseFormat<never> {
    return {
      success: false,
      error: errors[0], // Primer error como principal
      errors,
    };
  }

  /**
   * Recurso no encontrado (404)
   */
  static notFound(resource: string): ApiResponseFormat<never> {
    return this.error(`${resource} no encontrado`);
  }

  /**
   * No autorizado (401)
   */
  static unauthorized(message = 'No autorizado'): ApiResponseFormat<never> {
    return this.error(message);
  }

  /**
   * Prohibido (403)
   */
  static forbidden(message = 'Prohibido'): ApiResponseFormat<never> {
    return this.error(message);
  }

  /**
   * Bad Request (400)
   */
  static badRequest(message: string): ApiResponseFormat<never> {
    return this.error(message);
  }
}
