# Presentation Layer - Capa de Presentación

## 📍 Ubicación
`lib/server/presentation/` + `pages/api/` (Controllers)

## 🎯 Propósito
**Maneja HTTP requests/responses** y coordina la comunicación entre el cliente y la Application Layer.

**Depende de**: Application (usa Use Cases), Domain (tipos)

---

## 🧱 Estructura

```
lib/server/presentation/
├── middlewares/           ← Lógica previa al handler
│   ├── withAuth.ts       ← Validación de autenticación
│   └── withRole.ts       ← Validación de autorización
├── helpers/
│   └── ApiResponse.ts    ← Formato estándar de respuestas
├── types/
│   └── next.d.ts         ← Extensión de tipos de Next.js
└── docs/
    └── openapi.yaml      ← Especificación OpenAPI

pages/api/ (Controllers - Capa de Entrada)
├── movements/
│   ├── index.ts         ← GET /api/movements, POST /api/movements
│   └── [id].ts          ← PUT/DELETE /api/movements/:id
├── users/
│   ├── index.ts
│   └── [id].ts
├── reports/
│   └── index.ts
└── auth/
    └── [...all].ts      ← Better Auth handler
```

---

## 1. API Routes (Controllers)

### ¿Qué es un API Route en Next.js?

Archivo en `pages/api/` que maneja peticiones HTTP.

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' });
}
```

**Request**: `GET /api/hello`
**Response**: `{ "message": "Hello" }`

---

### Ejemplo: POST /api/movements

**Archivo**: `pages/api/movements/index.ts`

```typescript
import { getApplicationService } from '@/lib/server/infrastructure/ApplicationServiceFactory';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json(ApiResponse.error('Method not allowed'));
  }

  // 2. Extraer datos del body
  const { type, amount, concept, date } = req.body;

  // 3. Validaciones básicas
  if (!type || !amount || !concept || !date) {
    return res.status(400).json(
      ApiResponse.badRequest('Todos los campos son requeridos')
    );
  }

  try {
    // 4. Obtener servicio de aplicación
    const appService = getApplicationService();

    // 5. Ejecutar Use Case
    const result = await appService.createMovement.execute({
      type,
      amount: Number(amount),
      concept,
      date: new Date(date),
      userId: req.user.id, // ← Inyectado por withAuth
    });

    // 6. Manejar Result Pattern
    if (result.isFailure) {
      return res.status(400).json(ApiResponse.validationErrors(result.errors));
    }

    // 7. Respuesta exitosa
    return res.status(201).json(ApiResponse.success(result.value));
  } catch (error) {
    console.error('Error creating movement:', error);
    return res.status(500).json(
      ApiResponse.error('Error interno del servidor')
    );
  }
}

// 8. Aplicar middleware de autenticación
export default withAuth(handler);
```

**Flujo completo:**
```
Client → POST /api/movements
         ↓
withAuth → Valida sesión → Inyecta req.user
         ↓
handler → Extrae body → Valida campos
         ↓
ApplicationService → createMovement.execute()
         ↓
CreateMovementUseCase → PrismaMovementRepository.create()
         ↓
Prisma → INSERT INTO movements
         ↓
Result<Movement> → isSuccess?
         ↓
ApiResponse.success(data)
         ↓
Client ← 201 { success: true, data: {...} }
```

---

### Ejemplo: GET /api/movements

```typescript
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(ApiResponse.error('Method not allowed'));
  }

  // Query params: ?type=INCOME&startDate=2024-01-01
  const { type, startDate, endDate } = req.query;

  const appService = getApplicationService();
  
  const result = await appService.getMovements.execute({
    userId: req.user.role === 'ADMIN' ? undefined : req.user.id,
    type: type as 'INCOME' | 'EXPENSE' | undefined,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
  });

  // Queries normalmente no fallan (retornan array vacío)
  return res.status(200).json(ApiResponse.success(result.value));
}

export default withAuth(handler);
```

**URLs válidas:**
- `/api/movements` - Todos los movimientos del usuario
- `/api/movements?type=INCOME` - Solo ingresos
- `/api/movements?startDate=2024-01-01&endDate=2024-12-31` - Rango de fechas

---

### Ejemplo: DELETE /api/movements/[id].ts

```typescript
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json(ApiResponse.error('Method not allowed'));
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json(ApiResponse.badRequest('ID inválido'));
  }

  const appService = getApplicationService();

  const result = await appService.deleteMovement.execute({
    id,
    userId: req.user.id,
    userRole: req.user.role,
  });

  if (result.isFailure) {
    if (result.error.includes('no encontrado')) {
      return res.status(404).json(ApiResponse.notFound('Movimiento'));
    }
    if (result.error.includes('permiso')) {
      return res.status(403).json(ApiResponse.forbidden(result.error));
    }
    return res.status(400).json(ApiResponse.error(result.error));
  }

  return res.status(200).json(ApiResponse.success(result.value));
}

export default withAuth(handler);
```

**Status codes:**
- `200 OK`: Éxito
- `404 Not Found`: Movimiento no existe
- `403 Forbidden`: Sin permiso para eliminar

---

## 2. ApiResponse Helper

### Propósito
**Formato consistente** para todas las respuestas de la API.

### Implementación

```typescript
export interface ApiResponseFormat<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

export class ApiResponse {
  // ✅ Respuesta exitosa
  static success<T>(data: T): ApiResponseFormat<T> {
    return {
      success: true,
      data,
    };
  }

  // ❌ Error único
  static error(error: string): ApiResponseFormat<never> {
    return {
      success: false,
      error,
      errors: [error],
    };
  }

  // ❌ Múltiples errores de validación
  static validationErrors(errors: string[]): ApiResponseFormat<never> {
    return {
      success: false,
      error: errors[0], // Primer error como principal
      errors,
    };
  }

  // 404
  static notFound(resource: string): ApiResponseFormat<never> {
    return this.error(`${resource} not found`);
  }

  // 401
  static unauthorized(message = 'Unauthorized'): ApiResponseFormat<never> {
    return this.error(message);
  }

  // 403
  static forbidden(message = 'Forbidden'): ApiResponseFormat<never> {
    return this.error(message);
  }

  // 400
  static badRequest(message: string): ApiResponseFormat<never> {
    return this.error(message);
  }
}
```

### Uso

```typescript
// ✅ Éxito
return res.status(200).json(ApiResponse.success({ id: '123', name: 'John' }));
// { success: true, data: { id: '123', name: 'John' } }

// ❌ Error único
return res.status(400).json(ApiResponse.error('Email inválido'));
// { success: false, error: 'Email inválido', errors: ['Email inválido'] }

// ❌ Errores múltiples
return res.status(400).json(ApiResponse.validationErrors([
  'El monto debe ser mayor a 0.01',
  'El concepto debe tener al menos 3 caracteres'
]));
// { success: false, error: 'El monto...', errors: [...] }

// 404
return res.status(404).json(ApiResponse.notFound('Usuario'));
// { success: false, error: 'Usuario not found', errors: [...] }

// 401
return res.status(401).json(ApiResponse.unauthorized());
// { success: false, error: 'Unauthorized', errors: [...] }
```

**Ventajas:**
1. Frontend siempre sabe la estructura
2. Errores consistentes
3. TypeScript infiere tipos correctamente

---

## 3. Middlewares

### withAuth - Autenticación

**Propósito**: Verificar que el usuario esté autenticado antes de ejecutar el handler.

```typescript
import { auth } from '@/lib/auth';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withAuth =
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    // 1. Leer headers de la request
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    // 2. Verificar sesión con Better Auth
    const session = await auth.api.getSession({ headers });

    // 3. Si no hay sesión → 401
    if (!session || !session.user) {
      return res.status(401).json(ApiResponse.unauthorized());
    }

    // 4. Inyectar usuario en request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user.role as 'ADMIN' | 'USER') || 'USER',
    };

    // 5. Ejecutar handler original
    return handler(req, res);
  };
```

**Uso:**
```typescript
export default withAuth(handler);
// Ahora handler tiene acceso a req.user
```

**¿Qué hace?**
1. Lee el token de sesión de las cookies/headers
2. Consulta Better Auth para validar la sesión
3. Si válida: inyecta `req.user` y continúa
4. Si inválida: retorna 401 sin ejecutar handler

---

### withRole - Autorización

**Propósito**: Verificar que el usuario tenga el rol necesario.

```typescript
export const withRole =
  (allowedRoles: string[]) =>
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    // 1. Verificar autenticación primero
    if (!req.user) {
      return res.status(401).json(ApiResponse.unauthorized());
    }

    // 2. Verificar rol
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.forbidden('No tienes permisos para esta acción')
      );
    }

    // 3. Ejecutar handler
    return handler(req, res);
  };
```

**Uso:**
```typescript
// Solo admins
export default withAuth(withRole(['ADMIN'])(handler));

// Admins y users
export default withAuth(withRole(['ADMIN', 'USER'])(handler));
```

**Composición de middlewares:**
```
Client → Request
         ↓
withAuth → Verifica sesión → Inyecta req.user
         ↓
withRole(['ADMIN']) → Verifica rol
         ↓
handler → Lógica del endpoint
```

---

## 4. Error Handling Pattern

### En todos los endpoints

```typescript
try {
  // 1. Ejecutar Use Case
  const result = await appService.someUseCase.execute(input);

  // 2. Manejar Result Pattern
  if (result.isFailure) {
    // Decidir status code basado en el error
    if (result.error.includes('no encontrado')) {
      return res.status(404).json(ApiResponse.notFound('Recurso'));
    }
    if (result.error.includes('permiso')) {
      return res.status(403).json(ApiResponse.forbidden(result.error));
    }
    return res.status(400).json(ApiResponse.validationErrors(result.errors));
  }

  // 3. Éxito
  return res.status(200).json(ApiResponse.success(result.value));
} catch (error) {
  // 4. Errores inesperados
  console.error('Unexpected error:', error);
  return res.status(500).json(
    ApiResponse.error('Error interno del servidor')
  );
}
```

**Status codes estándar:**
- `200 OK`: Consulta exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Validación fallida
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado (tiene sesión pero no permisos)
- `404 Not Found`: Recurso no existe
- `405 Method Not Allowed`: Método HTTP incorrecto
- `500 Internal Server Error`: Error inesperado

---

## 5. Type Extensions

### next.d.ts

```typescript
declare module 'next' {
  interface NextApiRequest {
    user: {
      id: string;
      email: string;
      role: 'ADMIN' | 'USER';
    };
  }
}
```

**¿Por qué?**
Para que TypeScript reconozca `req.user` después de `withAuth`.

```typescript
// Sin extensión: ❌
const userId = req.user.id; // Error: Property 'user' does not exist

// Con extensión: ✅
const userId = req.user.id; // OK
```

---

## 6. OpenAPI Documentation

### openapi.yaml (Simplificado)

```yaml
openapi: 3.0.0
info:
  title: Sistema Gestión Ingresos API
  version: 1.0.0

paths:
  /api/movements:
    post:
      summary: Crear movimiento
      tags: [Movements]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  enum: [INCOME, EXPENSE]
                amount:
                  type: number
                  minimum: 0.01
                concept:
                  type: string
                  minLength: 3
                date:
                  type: string
                  format: date-time
      responses:
        '201':
          description: Movimiento creado
        '400':
          description: Error de validación
        '401':
          description: No autenticado
```

**Acceso**: `/api-docs` (renderizado con Swagger UI)

---

## 7. Separación Frontend/Backend

### ❌ Nunca compartir tipos entre frontend y backend

```typescript
// ❌ lib/shared/types/ApiResponse.ts (VIOLACIÓN)
export interface ApiResponse<T> { ... }

// Backend usa:
import { ApiResponse } from '@/lib/shared/types/ApiResponse';

// Frontend usa:
import { ApiResponse } from '@/lib/shared/types/ApiResponse';
```

**Problema**: Acopla frontend y backend. Si cambia uno, rompe el otro.

### ✅ Tipos separados

```typescript
// lib/server/presentation/helpers/ApiResponse.ts (BACKEND)
export interface ApiResponseFormat<T> { ... }
export class ApiResponse { ... }

// lib/client/api/client.ts (FRONTEND)
export interface ApiResponseFormat<T> { ... }
// Copia independiente, se comunican por HTTP/JSON
```

**Contrato**: Solo la estructura JSON en HTTP. No compartir código TypeScript.

---

## ❌ Lo que NO debe estar en Presentation

```typescript
// ❌ NO lógica de negocio
if (amount < 0.01) throw new Error(); // ← Domain

// ❌ NO orquestación compleja
const income = await getTotalIncome();
const expense = await getTotalExpense();
const balance = income - expense; // ← Use Case

// ❌ NO acceso directo a BD
await prisma.movement.create(); // ← Repository
```

**Presentation solo**:
- Valida HTTP (método, headers, auth)
- Extrae datos (body, query, params)
- Llama Use Cases
- Formatea respuestas

---

## ✅ Testing de Presentation

```typescript
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/movements/index';

describe('POST /api/movements', () => {
  it('should create movement', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        type: 'INCOME',
        amount: 100,
        concept: 'Salary',
        date: new Date().toISOString(),
      },
    });

    req.user = { id: '123', email: 'test@test.com', role: 'USER' };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toMatchObject({
      success: true,
      data: expect.objectContaining({
        amount: 100,
      }),
    });
  });

  it('should return 401 without auth', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    // No inyectar req.user

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });
});
```

---

## 🔗 Relación con otras capas

```
Client (HTTP) → Presentation → Application → Infrastructure
                     ↓              ↓              ↓
                 Middlewares    Use Cases    Repositories
                 ApiResponse      Result       Prisma
```

**Siguiente**: Lee `05-frontend-architecture.md` para ver cómo el cliente consume esta API.
