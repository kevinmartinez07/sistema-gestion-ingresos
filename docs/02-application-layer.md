# Application Layer - Capa de Aplicación

## 📍 Ubicación
`lib/server/application/`

## 🎯 Propósito
**Orquesta la lógica de negocio** sin implementar detalles técnicos. Coordina flujo entre Domain e Infrastructure usando **casos de uso** (Use Cases).

**Depende SOLO de Domain Layer** (entities, value objects, events).

---

## 🧱 Estructura

```
lib/server/application/
├── ApplicationService.ts      ← Servicio principal con DI
├── repositories/              ← Interfaces (contratos)
│   ├── IMovementRepository.ts
│   └── IUserRepository.ts
├── shared/                    ← Código compartido
│   ├── Result.ts             ← Result Pattern
│   └── index.ts
└── use-cases/
    ├── movements/
    │   ├── commands/         ← CQRS: Comandos (escritura)
    │   │   ├── CreateMovementUseCase.ts
    │   │   └── DeleteMovementUseCase.ts
    │   ├── queries/          ← CQRS: Consultas (lectura)
    │   │   ├── GetMovementsUseCase.ts
    │   │   └── GetBalanceUseCase.ts
    │   └── dtos/             ← Data Transfer Objects
    │       ├── CreateMovementRequest.ts
    │       ├── CreateMovementResponse.ts
    │       ├── GetMovementsRequest.ts
    │       └── ...
    └── users/
        ├── commands/
        │   ├── UpdateUserUseCase.ts
        │   └── DeleteUserUseCase.ts
        ├── queries/
        │   └── GetUsersUseCase.ts
        └── dtos/
```

---

## 1. Use Cases (Casos de Uso)

### Definición
**Una acción específica que un usuario puede realizar.** Un caso de uso = una función del sistema.

### Patrón CQRS (Command Query Responsibility Segregation)

- **Commands (Comandos)**: Modifican estado (Create, Update, Delete)
- **Queries (Consultas)**: Solo leen datos (Get, List, Search)

### Estructura de un Use Case

```typescript
export class CreateMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}
  
  async execute(input: CreateMovementRequest): Promise<Result<CreateMovementResponse>> {
    // 1. Validar entrada
    // 2. Llamar Domain/Repository
    // 3. Retornar Result
  }
}
```

---

## 2. Result Pattern

### ¿Por qué no usar try/catch en toda la aplicación?

```typescript
// ❌ Problema: No sabes si puede lanzar error
async function createMovement(data) {
  const movement = await repository.create(data); // ¿Lanza error?
  return movement;
}

// Debes adivinar
try {
  const movement = await createMovement(data);
} catch (error) {
  // ¿Qué tipo de error?
}
```

```typescript
// ✅ Solución: Result Pattern hace explícitos los fallos
async function createMovement(data): Promise<Result<Movement>> {
  try {
    const movement = await repository.create(data);
    return Result.ok(movement); // Éxito explícito
  } catch (error) {
    return Result.fail(error.message); // Error explícito
  }
}

// Uso claro
const result = await createMovement(data);
if (result.isFailure) {
  console.error(result.error);
  return;
}
const movement = result.value; // TypeScript sabe que existe
```

### Implementación: Result.ts

```typescript
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string,
    private readonly _errors?: string[]
  ) {}

  get isSuccess(): boolean { return this._isSuccess; }
  get isFailure(): boolean { return !this._isSuccess; }
  
  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }
  
  get error(): string { return this._error || ''; }
  get errors(): string[] { return this._errors || []; }

  // Factory methods
  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error, [error]);
  }

  static failWithErrors<U>(errors: string[]): Result<U> {
    return new Result<U>(false, undefined, errors[0], errors);
  }
}
```

**Ventajas:**
1. ✅ Explícito: el tipo dice que puede fallar
2. ✅ Seguro: TypeScript obliga a manejar errores
3. ✅ Testeable: fácil mockear éxito/fallo
4. ✅ Sin excepciones: errores son valores, no side effects

---

## 3. Command Use Cases (Escritura)

### CreateMovementUseCase

```typescript
export class CreateMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    input: CreateMovementRequest
  ): Promise<Result<CreateMovementResponse>> {
    try {
      // 1. Repository crea Movement (con Value Objects validando)
      const movement = await this.movementRepository.create(input);

      // 2. Mapear a Response DTO
      const response: CreateMovementResponse = {
        id: movement.id,
        type: movement.type,
        amount: movement.amount,
        concept: movement.concept,
        date: movement.date,
        userId: movement.userId,
        createdAt: movement.createdAt,
        updatedAt: movement.updatedAt,
      };

      // 3. Retornar éxito
      return Result.ok(response);
    } catch (error) {
      // 4. Value Objects lanzan Error si datos inválidos
      return Result.fail((error as Error).message);
    }
  }
}
```

**Flujo de validación:**
```
1. CreateMovementUseCase recibe { type, amount, concept, ... }
2. Llama repository.create(data)
3. Repository crea new Movement(...)
4. Movement constructor llama Money.create(amount)
5. Money.create() valida 0.01 ≤ amount ≤ 999,999,999.99
6. Si inválido: Money lanza Error
7. Use Case catch el error → Result.fail(mensaje)
8. Si válido: Movement se crea → Result.ok(movement)
```

### DeleteMovementUseCase

```typescript
export class DeleteMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    input: DeleteMovementRequest
  ): Promise<Result<{ success: boolean }>> {
    try {
      // 1. Validar que existe
      const movement = await this.movementRepository.findById(input.id);
      if (!movement) {
        return Result.fail('Movimiento no encontrado');
      }

      // 2. Verificar permisos (solo dueño o admin)
      if (movement.userId !== input.userId && input.userRole !== 'ADMIN') {
        return Result.fail(
          'No tienes permiso para eliminar este movimiento'
        );
      }

      // 3. Eliminar
      await this.movementRepository.delete(input.id);

      return Result.ok({ success: true });
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }
}
```

**Lógica de negocio:**
- Solo el dueño puede eliminar su movimiento
- Los admins pueden eliminar cualquier movimiento

### UpdateUserUseCase

```typescript
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    input: UpdateUserRequest
  ): Promise<Result<UpdateUserResponse>> {
    // Validación básica
    if (!input.id) {
      return Result.fail('ID de usuario requerido');
    }

    try {
      // Value Objects validan automáticamente
      const user = await this.userRepository.update(input.id, {
        name: input.name,
        role: input.role,
        phone: input.phone,
      });

      return Result.ok({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }
}
```

---

## 4. Query Use Cases (Lectura)

### GetBalanceUseCase

```typescript
export class GetBalanceUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    query?: GetBalanceRequest
  ): Promise<Result<GetBalanceResponse>> {
    // Consultas en paralelo (optimización)
    const [totalIncome, totalExpense] = await Promise.all([
      this.movementRepository.getTotalIncome(query?.userId),
      this.movementRepository.getTotalExpense(query?.userId),
    ]);

    return Result.ok({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  }
}
```

**Queries nunca fallan** (si no hay datos, retornan 0 o array vacío).

### GetMovementsUseCase

```typescript
export class GetMovementsUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    query: GetMovementsRequest
  ): Promise<Result<GetMovementsResponse>> {
    const movements = await this.movementRepository.findAll({
      userId: query.userId,
      type: query.type,
      startDate: query.startDate,
      endDate: query.endDate,
    });

    return Result.ok({
      movements: movements.map((m) => ({
        id: m.id,
        type: m.type,
        amount: m.amount,
        concept: m.concept,
        date: m.date,
        userId: m.userId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      total: movements.length,
    });
  }
}
```

---

## 5. Repository Interfaces (Contratos)

### IMovementRepository.ts

```typescript
import { Movement } from '../../domain/entities/Movement';
import {
  CreateMovementData,
  MovementFilters,
  UpdateMovementData,
} from '../use-cases/movements/dtos/MovementRepositoryDTO';

export interface IMovementRepository {
  // Commands
  create(data: CreateMovementData): Promise<Movement>;
  update(id: string, data: UpdateMovementData): Promise<Movement>;
  delete(id: string): Promise<void>;

  // Queries
  findById(id: string): Promise<Movement | null>;
  findAll(filters?: MovementFilters): Promise<Movement[]>;
  countByUserId(userId: string): Promise<number>;
  
  // Aggregations
  getTotalBalance(userId?: string): Promise<number>;
  getTotalIncome(userId?: string): Promise<number>;
  getTotalExpense(userId?: string): Promise<number>;
}
```

**Clave**: Es una **interface**, no una implementación. La implementación está en Infrastructure.

---

## 6. DTOs (Data Transfer Objects)

### ¿Por qué DTOs?

```typescript
// ❌ Problema: Exponer Domain Entity directamente
async execute(input): Promise<Movement> {
  return await this.repository.create(input);
}
// La API retorna todo, incluso métodos privados

// ✅ Solución: DTO controla qué se expone
async execute(input: CreateMovementRequest): Promise<Result<CreateMovementResponse>> {
  const movement = await this.repository.create(input);
  
  return Result.ok({
    id: movement.id,        // Solo lo necesario
    type: movement.type,
    amount: movement.amount,
    // NO exponemos métodos ni propiedades internas
  });
}
```

### CreateMovementRequest.ts

```typescript
export interface CreateMovementRequest {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  concept: string;
  date: Date;
  userId: string;
}
```

### CreateMovementResponse.ts

```typescript
export interface CreateMovementResponse {
  id: string;
  type: string;
  amount: number;
  concept: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Request vs Response**:
- **Request**: Lo que recibe el Use Case (entrada)
- **Response**: Lo que retorna el Use Case (salida)

---

## 7. ApplicationService (Dependency Injection)

```typescript
export class ApplicationService {
  // Repositories (Infrastructure)
  public readonly movementRepository: IMovementRepository;
  public readonly userRepository: IUserRepository;

  // Use Cases - Movements
  public readonly createMovement: CreateMovementUseCase;
  public readonly deleteMovement: DeleteMovementUseCase;
  public readonly getMovements: GetMovementsUseCase;
  public readonly getBalance: GetBalanceUseCase;

  // Use Cases - Users
  public readonly updateUser: UpdateUserUseCase;
  public readonly deleteUser: DeleteUserUseCase;
  public readonly getUsers: GetUsersUseCase;

  constructor(
    movementRepository: IMovementRepository,
    userRepository: IUserRepository
  ) {
    this.movementRepository = movementRepository;
    this.userRepository = userRepository;

    // Inyectar dependencias a Use Cases
    this.createMovement = new CreateMovementUseCase(movementRepository);
    this.deleteMovement = new DeleteMovementUseCase(movementRepository);
    this.getMovements = new GetMovementsUseCase(movementRepository);
    this.getBalance = new GetBalanceUseCase(movementRepository);

    this.updateUser = new UpdateUserUseCase(userRepository);
    this.deleteUser = new DeleteUserUseCase(userRepository);
    this.getUsers = new GetUsersUseCase(userRepository);
  }
}
```

**Uso en API Route:**
```typescript
// pages/api/movements/index.ts
import { getApplicationService } from '@/lib/server/infrastructure/ApplicationServiceFactory';

export default async function handler(req, res) {
  const appService = getApplicationService();
  
  // Usar Use Case directamente
  const result = await appService.createMovement.execute(data);
  
  if (result.isFailure) {
    return ApiResponse.validationErrors(res, result.errors);
  }
  
  return ApiResponse.success(res, result.value);
}
```

---

## 🎯 Principios de Application Layer

1. **Un Use Case = Una Acción del Usuario**
   - CreateMovementUseCase: "Crear movimiento"
   - GetBalanceUseCase: "Ver balance"

2. **Siempre retornar Result<T>**
   - Éxitos: `Result.ok(value)`
   - Errores: `Result.fail(message)`

3. **Dependencias mediante Interfaces**
   - Use Cases reciben `IMovementRepository`, no `PrismaMovementRepository`
   - Permite cambiar implementación sin tocar Use Cases

4. **DTOs para entrada/salida**
   - Request: datos primitivos (no Domain Entities)
   - Response: datos serializables (no métodos de entidad)

5. **No acceder a bases de datos directamente**
   - Usar Repository Interfaces
   - Infrastructure implementa el acceso real

---

## ❌ Lo que NO debe estar en Application

```typescript
// ❌ NO importar Prisma
import { PrismaClient } from '@prisma/client';

// ❌ NO manejar HTTP
import { NextApiResponse } from 'next';
res.status(200).json();

// ❌ NO lógica de negocio compleja (eso es Domain)
if (amount < 0.01) throw new Error(); // ← Esto va en Money Value Object

// ❌ NO implementar repositorios (eso es Infrastructure)
await prisma.movement.create();
```

---

## ✅ Testing de Application

```typescript
describe('CreateMovementUseCase', () => {
  it('should create movement', async () => {
    // Mock repository (sin base de datos)
    const mockRepo: IMovementRepository = {
      create: jest.fn().mockResolvedValue(mockMovement),
    };
    
    const useCase = new CreateMovementUseCase(mockRepo);
    
    const result = await useCase.execute({
      type: 'INCOME',
      amount: 100,
      concept: 'Salary',
      date: new Date(),
      userId: '123',
    });
    
    expect(result.isSuccess).toBe(true);
    expect(result.value.amount).toBe(100);
  });
});
```

Ver tests en: `__tests__/domain/use-cases/`

---

## 🔗 Relación con otras capas

```
Presentation → Application → Domain
                ↓
           Infrastructure
```

- **Application depende de**: Domain (entities, value objects)
- **Application define**: Interfaces de repositorios
- **Infrastructure implementa**: Las interfaces de Application
- **Presentation llama**: Use Cases de Application

**Siguiente**: Lee `03-infrastructure-layer.md` para ver cómo se implementan los repositorios con Prisma.
