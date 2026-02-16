# Infrastructure Layer - Capa de Infraestructura

## 📍 Ubicación
`lib/server/infrastructure/`

## 🎯 Propósito
**Implementa los detalles técnicos** y conecta el sistema con tecnologías externas (base de datos, APIs, archivos, etc.).

**Depende de**: Domain y Application (implementa interfaces de Application).

---

## 🧱 Estructura

```
lib/server/infrastructure/
├── prisma/
│   └── client.ts              ← Cliente singleton de Prisma
├── repositories/              ← Implementaciones de IRepository
│   ├── PrismaMovementRepository.ts
│   └── PrismaUserRepository.ts
└── ApplicationServiceFactory.ts  ← Factory para DI
```

---

## 1. Prisma ORM

### ¿Qué es Prisma?

Prisma es un ORM (Object-Relational Mapping) moderno para TypeScript que:
- Genera cliente tipado desde un schema
- Abstrae SQL con API TypeScript
- Maneja migraciones de base de datos

### Schema: prisma/schema.prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Movement {
  id        String   @id @default(cuid())
  type      String   // INCOME o EXPENSE
  amount    Decimal  @db.Decimal(12, 2)
  concept   String
  date      DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([type])
  @@index([date])
}

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  phone     String?
  role      String     @default("USER")
  movements Movement[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

**Comandos Prisma:**
```bash
npx prisma generate    # Genera cliente TypeScript
npx prisma migrate dev # Crea migración
npx prisma studio      # Interfaz visual de BD
```

### Cliente Singleton: prisma/client.ts

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Patrón Singleton**: Una sola instancia de PrismaClient en toda la aplicación (evita "too many connections" en desarrollo).

---

## 2. Repository Pattern Implementado

### PrismaMovementRepository.ts

```typescript
import { Prisma } from '@prisma/client';
import { IMovementRepository } from '../../application/repositories/IMovementRepository';
import { Movement, MovementType } from '../../domain/entities/Movement';
import { prisma } from '../prisma/client';

export class PrismaMovementRepository implements IMovementRepository {
  
  // ============ COMMANDS ============
  
  async create(data: CreateMovementData): Promise<Movement> {
    // 1. Persistir en PostgreSQL con Prisma
    const movement = await prisma.movement.create({
      data: {
        type: data.type,
        amount: data.amount,
        concept: data.concept,
        date: data.date,
        userId: data.userId,
      },
    });

    // 2. Convertir modelo Prisma → Domain Entity
    return this.toDomain(movement);
  }

  async update(id: string, data: UpdateMovementData): Promise<Movement> {
    const updateData: Record<string, unknown> = {};

    if (data.type !== undefined) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.concept !== undefined) updateData.concept = data.concept;
    if (data.date !== undefined) updateData.date = data.date;

    const movement = await prisma.movement.update({
      where: { id },
      data: updateData,
    });

    return this.toDomain(movement);
  }

  async delete(id: string): Promise<void> {
    await prisma.movement.delete({
      where: { id },
    });
  }

  // ============ QUERIES ============

  async findById(id: string): Promise<Movement | null> {
    const movement = await prisma.movement.findUnique({
      where: { id },
    });

    return movement ? this.toDomain(movement) : null;
  }

  async findAll(filters?: MovementFilters): Promise<Movement[]> {
    const where: Record<string, unknown> = {};

    if (filters) {
      if (filters.userId) where.userId = filters.userId;
      if (filters.type) where.type = filters.type;
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) 
          (where.date as Record<string, unknown>).gte = filters.startDate;
        if (filters.endDate) 
          (where.date as Record<string, unknown>).lte = filters.endDate;
      }
    }

    const movements = await prisma.movement.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: true, // Eager loading de relación
      },
    });

    return movements.map((m) => this.toDomain(m));
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.movement.count({
      where: { userId },
    });
  }

  // ============ AGGREGATIONS ============

  async getTotalIncome(userId?: string): Promise<number> {
    const result = await prisma.movement.aggregate({
      where: {
        type: 'INCOME',
        ...(userId && { userId }),
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getTotalExpense(userId?: string): Promise<number> {
    const result = await prisma.movement.aggregate({
      where: {
        type: 'EXPENSE',
        ...(userId && { userId }),
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getTotalBalance(userId?: string): Promise<number> {
    const [income, expense] = await Promise.all([
      this.getTotalIncome(userId),
      this.getTotalExpense(userId),
    ]);
    
    return income - expense;
  }

  // ============ MAPPER ============

  private toDomain(prismaMovement: any): Movement {
    return new Movement(
      prismaMovement.id,
      prismaMovement.type as MovementType,
      Number(prismaMovement.amount),
      prismaMovement.concept,
      new Date(prismaMovement.date),
      prismaMovement.userId,
      new Date(prismaMovement.createdAt),
      new Date(prismaMovement.updatedAt)
    );
  }
}
```

---

## 3. Mapper Pattern: Prisma → Domain

### ¿Por qué necesitamos toDomain()?

```typescript
// Prisma retorna su propio modelo
const prismaMovement = await prisma.movement.findUnique({ where: { id } });
// Tipo: { id: string, amount: Prisma.Decimal, date: Date, ... }

// Domain usa entidades con Value Objects
const domainMovement = this.toDomain(prismaMovement);
// Tipo: Movement (con Money, Concept, MovementType)
```

### Transformaciones en toDomain()

1. **Prisma.Decimal → number**
   ```typescript
   Number(prismaMovement.amount) // 100.50
   ```

2. **string → MovementType Value Object**
   ```typescript
   prismaMovement.type as MovementType // "INCOME" | "EXPENSE"
   ```

3. **Date strings → Date objects**
   ```typescript
   new Date(prismaMovement.date)
   ```

4. **Constructor de Movement activa validaciones**
   ```typescript
   new Movement(...)
   // Internamente llama:
   // - Money.create(amount) ← Valida rango
   // - Concept.create(concept) ← Valida longitud
   // - MovementTypeVO.fromString(type) ← Valida enum
   ```

---

## 4. Prisma Query Patterns

### WHERE con tipos complejos

```typescript
// Filtro dinámico
const where: Record<string, unknown> = {};

if (filters.userId) {
  where.userId = filters.userId;
}

if (filters.startDate || filters.endDate) {
  where.date = {};
  if (filters.startDate) {
    (where.date as Record<string, unknown>).gte = filters.startDate;
  }
  if (filters.endDate) {
    (where.date as Record<string, unknown>).lte = filters.endDate;
  }
}

await prisma.movement.findMany({ where });
```

**SQL generado:**
```sql
SELECT * FROM movements
WHERE userId = $1
  AND date >= $2
  AND date <= $3
ORDER BY date DESC
```

### Eager Loading (include)

```typescript
await prisma.movement.findMany({
  include: {
    user: true, // JOIN con tabla users
  },
});
```

### Aggregations

```typescript
const result = await prisma.movement.aggregate({
  where: { type: 'INCOME' },
  _sum: { amount: true },
  _count: true,
  _avg: { amount: true },
});

console.log(result._sum.amount); // Total de ingresos
console.log(result._count);      // Cantidad de movimientos
console.log(result._avg.amount); // Promedio
```

### Transacciones

```typescript
await prisma.$transaction([
  prisma.movement.create({ data: movement1 }),
  prisma.movement.create({ data: movement2 }),
  prisma.user.update({ where: { id }, data: { ... } }),
]);
// Todo se ejecuta o todo falla (atomic)
```

---

## 5. ApplicationServiceFactory (Dependency Injection)

```typescript
import { ApplicationService } from '../application/ApplicationService';
import { PrismaMovementRepository } from './repositories/PrismaMovementRepository';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';

let applicationService: ApplicationService | null = null;

export function getApplicationService(): ApplicationService {
  if (!applicationService) {
    // 1. Instanciar implementaciones concretas
    const movementRepository = new PrismaMovementRepository();
    const userRepository = new PrismaUserRepository();

    // 2. Inyectar en ApplicationService
    applicationService = new ApplicationService(
      movementRepository,
      userRepository
    );
  }

  return applicationService;
}
```

**Patrón Singleton + Factory**: Una sola instancia del servicio con todas las dependencias configuradas.

**Uso en API Routes:**
```typescript
import { getApplicationService } from '@/lib/server/infrastructure/ApplicationServiceFactory';

export default async function handler(req, res) {
  const appService = getApplicationService();
  
  // Usar Use Cases
  const result = await appService.createMovement.execute(data);
}
```

---

## 6. Ventajas del Repository Pattern

### ✅ Testeable

```typescript
// Test sin base de datos
const mockRepository: IMovementRepository = {
  create: jest.fn().mockResolvedValue(mockMovement),
  findById: jest.fn().mockResolvedValue(null),
  // ...
};

const useCase = new CreateMovementUseCase(mockRepository);
```

### ✅ Intercambiable

```typescript
// Hoy: Prisma + PostgreSQL
const movementRepo = new PrismaMovementRepository();

// Mañana: TypeORM + MySQL (sin cambiar Use Cases)
const movementRepo = new TypeORMMovementRepository();

// O: In-Memory para tests
const movementRepo = new InMemoryMovementRepository();
```

### ✅ Encapsulación

```typescript
// Application no sabe que usamos Prisma
const movement = await repository.create(data);

// Podría ser SQL directo, MongoDB, archivo JSON...
// Application no le importa
```

---

## 7. Prisma vs Raw SQL

### Con Prisma (Type-safe)

```typescript
const movements = await prisma.movement.findMany({
  where: {
    userId: '123',
    type: 'INCOME',
    date: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
  orderBy: { date: 'desc' },
  include: { user: true },
});
// TypeScript conoce el tipo exacto
```

### Con Raw SQL (Sin tipos)

```typescript
const movements = await prisma.$queryRaw`
  SELECT m.*, u.*
  FROM movements m
  JOIN users u ON m.userId = u.id
  WHERE m.userId = ${userId}
    AND m.type = 'INCOME'
    AND m.date >= ${startDate}
    AND m.date <= ${endDate}
  ORDER BY m.date DESC
`;
// Tipo: any[] (sin validación)
```

**Prisma evita**:
- SQL injection (parámetros escapados)
- Typos en nombres de campos
- Errores de tipado

---

## 8. Migraciones de Base de Datos

### Crear migración

```bash
npx prisma migrate dev --name add_phone_to_users
```

**Genera:**
```sql
-- CreateTable si no existe
-- AlterTable si modifica
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
```

### Aplicar en producción

```bash
npx prisma migrate deploy
```

### Sincronizar schema sin migración (dev)

```bash
npx prisma db push
```

---

## ❌ Lo que NO debe estar en Infrastructure

```typescript
// ❌ NO lógica de negocio
if (amount < 0.01) throw new Error(); // ← Esto va en Domain

// ❌ NO control de flujo de aplicación
if (user.role !== 'ADMIN') return; // ← Esto va en Application

// ❌ NO manejo de HTTP
res.status(200).json(); // ← Esto va en Presentation
```

**Infrastructure solo**:
- Ejecuta queries
- Convierte datos (Prisma → Domain)
- Maneja conexiones

---

## ✅ Testing de Infrastructure

### Opción 1: Tests de integración (con BD de prueba)

```typescript
describe('PrismaMovementRepository', () => {
  beforeAll(async () => {
    // Conectar a BD de test
    await prisma.$connect();
  });

  it('should create movement', async () => {
    const repo = new PrismaMovementRepository();
    
    const movement = await repo.create({
      type: 'INCOME',
      amount: 100,
      concept: 'Test',
      date: new Date(),
      userId: testUserId,
    });

    expect(movement.amount).toBe(100);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
```

### Opción 2: Mocks (sin BD)

```typescript
jest.mock('../prisma/client', () => ({
  prisma: {
    movement: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));
```

---

## 🔗 Relación con otras capas

```
Presentation → Application → Infrastructure
                      ↓              ↓
                   Domain      PostgreSQL/Prisma
```

- **Infrastructure implementa**: Interfaces de Application
- **Infrastructure usa**: Entities de Domain
- **Infrastructure accede**: Base de datos externa
- **Application llama**: Métodos de repositories (sin saber cómo funcionan internamente)

**Siguiente**: Lee `04-presentation-layer.md` para ver cómo se exponen estos datos via HTTP.
