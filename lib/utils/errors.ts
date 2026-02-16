/**
 * Sistema de Errores Personalizados
 * Define tipos de errores específicos para mejor control y manejo
 */

/**
 * Clase base para errores de la aplicación
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly userMessage: string;

  constructor(
    message: string,
    statusCode: number,
    userMessage?: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage || message;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error de validación (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      400,
      userMessage || 'Los datos proporcionados no son válidos'
    );
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error de autenticación (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      401,
      userMessage || 'Por favor, inicia sesión para continuar'
    );
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error de autorización (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 403, userMessage || 'No tienes permiso para esta acción');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Error de recurso no encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, userMessage?: string) {
    super(
      `${resource} not found`,
      404,
      userMessage || 'El recurso solicitado no existe'
    );
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error de conflicto (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 409, userMessage || 'Ya existe un recurso con esos datos');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Error del servidor (500)
 */
export class ServerError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      500,
      userMessage || 'Error del servidor. Por favor, intenta nuevamente.',
      false
    );
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Error de gateway (502)
 */
export class BadGatewayError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      502,
      userMessage ||
        'Error de conexión con el servidor. Por favor, intenta nuevamente.',
      false
    );
    Object.setPrototypeOf(this, BadGatewayError.prototype);
  }
}

/**
 * Servicio no disponible (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      503,
      userMessage ||
        'El servicio no está disponible temporalmente. Por favor, intenta más tarde.',
      false
    );
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Timeout del gateway (504)
 */
export class GatewayTimeoutError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      504,
      userMessage ||
        'El servidor tardó demasiado en responder. Por favor, intenta nuevamente.',
      false
    );
    Object.setPrototypeOf(this, GatewayTimeoutError.prototype);
  }
}

/**
 * Error de red/conexión
 */
export class NetworkError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      0,
      userMessage ||
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    );
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Resultado de parseado de error
 */
export interface ParsedError {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  canRetry: boolean;
}

/**
 * Parsea errores HTTP y retorna información estructurada
 */
export function parseHttpError(error: unknown): ParsedError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Error de Conexión',
      message:
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      type: 'error',
      canRetry: true,
    };
  }

  if (error instanceof AppError) {
    return {
      title: getErrorTitle(error.statusCode),
      message: error.message || error.userMessage,
      type: error.statusCode >= 500 ? 'error' : 'warning',
      canRetry: error.statusCode >= 500,
    };
  }

  if (error && typeof error === 'object' && 'statusCode' in error) {
    const { statusCode } = error as { statusCode: number };
    return {
      title: getErrorTitle(statusCode),
      message: getErrorMessage(statusCode),
      type: statusCode >= 500 ? 'error' : 'warning',
      canRetry: statusCode >= 500,
    };
  }

  return {
    title: 'Error Inesperado',
    message:
      'Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.',
    type: 'error',
    canRetry: true,
  };
}

/**
 * Obtiene el título del error según el código HTTP
 */
function getErrorTitle(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Datos Inválidos';
    case 401:
      return 'No Autenticado';
    case 403:
      return 'Acceso Denegado';
    case 404:
      return 'No Encontrado';
    case 409:
      return 'Conflicto';
    case 422:
      return 'Error de Validación';
    case 429:
      return 'Demasiadas Peticiones';
    case 500:
      return 'Error del Servidor';
    case 502:
      return 'Error de Gateway';
    case 503:
      return 'Servicio No Disponible';
    case 504:
      return 'Tiempo de Espera Agotado';
    default:
      return 'Error';
  }
}

/**
 * Obtiene el mensaje del error según el código HTTP
 */
function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Los datos proporcionados no son válidos. Revisa la información e intenta nuevamente.';
    case 401:
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'No tienes permiso para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no existe o ha sido eliminado.';
    case 409:
      return 'Ya existe un recurso con esos datos.';
    case 422:
      return 'Los datos no cumplen con los requisitos. Verifica e intenta nuevamente.';
    case 429:
      return 'Has realizado demasiadas peticiones. Por favor, espera un momento e intenta nuevamente.';
    case 500:
      return 'Ocurrió un error en el servidor. Nuestro equipo ha sido notificado.';
    case 502:
      return 'Error de conexión con el servidor. Por favor, intenta nuevamente.';
    case 503:
      return 'El servicio no está disponible temporalmente. Por favor, intenta más tarde.';
    case 504:
      return 'El servidor tardó demasiado en responder. Por favor, intenta nuevamente.';
    default:
      return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
  }
}

/**
 * Maneja errores de fetch y lanza errores tipados
 */
// eslint-disable-next-line complexity
export async function handleFetchError(response: Response): Promise<never> {
  const contentType = response.headers.get('content-type');
  let errorData: { error?: string; message?: string } = {};

  // Intentar parsear JSON si es posible
  if (contentType && contentType.includes('application/json')) {
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: `Error ${response.status}: ${response.statusText}`,
      };
    }
  }

  const errorMessage =
    errorData.error || errorData.message || response.statusText;

  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage);
    case 401:
      throw new AuthenticationError(errorMessage);
    case 403:
      throw new AuthorizationError(errorMessage);
    case 404:
      throw new NotFoundError(errorMessage);
    case 409:
      throw new ConflictError(errorMessage);
    case 422:
      throw new ValidationError(errorMessage);
    case 500:
      throw new ServerError(errorMessage);
    case 502:
      throw new BadGatewayError(errorMessage);
    case 503:
      throw new ServiceUnavailableError(errorMessage);
    case 504:
      throw new GatewayTimeoutError(errorMessage);
    default:
      throw new AppError(errorMessage, response.status);
  }
}
