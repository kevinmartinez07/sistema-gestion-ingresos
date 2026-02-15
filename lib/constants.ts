/**
 * Constantes de la aplicación
 * Centraliza strings, configuraciones y valores mágicos
 */

// ===== ROLES =====
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// ===== TIPOS DE MOVIMIENTO =====
export const MOVEMENT_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export const MOVEMENT_TYPE_LABELS = {
  [MOVEMENT_TYPES.INCOME]: 'Ingreso',
  [MOVEMENT_TYPES.EXPENSE]: 'Egreso',
} as const;

// ===== RUTAS =====
export const ROUTES = {
  HOME: '/',
  MOVEMENTS: '/movements',
  USERS: '/users',
  REPORTS: '/reports',
  API_DOCS: '/api-docs',
} as const;

// ===== MENSAJES =====
export const MESSAGES = {
  SUCCESS: {
    MOVEMENT_CREATED: 'Movimiento creado exitosamente',
    MOVEMENT_DELETED: 'Movimiento eliminado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    CSV_DOWNLOADED: 'Reporte descargado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ocurrió un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    NOT_FOUND: 'Recurso no encontrado',
    INVALID_DATA: 'Los datos ingresados no son válidos',
  },
  LOADING: {
    FETCHING: 'Cargando...',
    SAVING: 'Guardando...',
    DELETING: 'Eliminando...',
    DOWNLOADING: 'Descargando...',
  },
  EMPTY_STATE: {
    NO_MOVEMENTS: 'No hay movimientos registrados',
    NO_USERS: 'No hay usuarios registrados',
    NO_RESULTS: 'No se encontraron resultados',
    START_ADDING: 'Comienza agregando tu primer registro',
    ADJUST_FILTERS: 'Intenta ajustar los filtros',
  },
} as const;

// ===== CONFIGURACIÓN =====
export const CONFIG = {
  APP_NAME: 'Sistema de Gestión de Ingresos y Egresos',
  CURRENCY: 'USD',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  ITEMS_PER_PAGE: 10,
  MAX_RECENT_MOVEMENTS: 10,
  CHART_COLORS: {
    INCOME: '#10b981',
    EXPENSE: '#ef4444',
    PRIMARY: '#0ea5e9',
    ACCENT: '#9333ea',
  },
} as const;

// ===== VALIDACIONES =====
export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
  MIN_CONCEPT_LENGTH: 3,
  MAX_CONCEPT_LENGTH: 200,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  PHONE_PATTERN: /^[0-9]{10,15}$/,
} as const;

// ===== PLACEHOLDER/DEFAULTS =====
export const PLACEHOLDERS = {
  SEARCH_CONCEPT: 'Buscar por concepto...',
  ENTER_AMOUNT: 'Ingresa el monto',
  ENTER_CONCEPT: 'Ej: Pago de servicios',
  ENTER_NAME: 'Nombre completo',
  ENTER_PHONE: '1234567890',
  SELECT_DATE: 'Selecciona una fecha',
  SELECT_TYPE: 'Selecciona el tipo',
  SELECT_ROLE: 'Selecciona el rol',
} as const;

// ===== FILTROS =====
export const FILTER_OPTIONS = {
  ALL: 'ALL',
  INCOME: MOVEMENT_TYPES.INCOME,
  EXPENSE: MOVEMENT_TYPES.EXPENSE,
} as const;

export const FILTER_LABELS = {
  [FILTER_OPTIONS.ALL]: 'Todos',
  [FILTER_OPTIONS.INCOME]: 'Ingresos',
  [FILTER_OPTIONS.EXPENSE]: 'Egresos',
} as const;
