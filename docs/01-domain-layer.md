# Domain Layer - Capa de Dominio

## 📍 Ubicación
`lib/server/domain/`

## 🎯 Propósito
**Contiene las reglas de negocio puras.** Esta capa NO depende de ninguna otra capa, framework o tecnología externa.

## 🧱 Estructura

```
lib/server/domain/
├── entities/           ← Objetos con identidad
│   ├── Movement.ts    ← Entidad movimiento (ingresos/egresos)
│   └── User.ts        ← Entidad usuario
├── value-objects/     ← Objetos inmutables con validación
│   ├── Money.ts       ← Manejo de dinero
│   ├── Concept.ts     ← Descripción del movimiento
│   ├── Email.ts       ← Validación de email
│   ├── Phone.ts       ← Validación de teléfono
│   ├── MovementType.ts← INCOME o EXPENSE
│   └── Role.ts        ← ADMIN o USER
└── events/            ← Eventos de dominio
    ├── DomainEvent.ts
    ├── MovementEvents.ts
    └── UserEvents.ts
```

---

## 1. Entities (Entidades)

### Definición
Objetos con **identidad única** que persisten en el tiempo. Dos entidades son diferentes si tienen IDs distintos, aunque tengan los mismos datos.

### Características
- Tienen un `id` único
- Tienen ciclo de vida (creación, modificación, eliminación)
- Contienen lógica de negocio
- Pueden emitir eventos de dominio

### Ejemplo: Movement.ts

```typescript
export class Movement {
  private readonly _type: MovementTypeVO;
  private _amount: Money;
  private _concept: Concept;

  constructor(
    public readonly id: string,           // ← Identidad única
    typeValue: MovementType,
    amountValue: number,
    conceptValue: string,
    public date: Date,
    public readonly userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    // Value Objects validan al instanciarse
    this._type = MovementTypeVO.fromString(typeValue);
    this._amount = Money.create(amountValue);
    this._concept = Concept.create(conceptValue);
    this.validateDate();
  }

  // Métodos de negocio
  update(data: {
    type?: MovementType;
    amount?: number;
    concept?: string;
    date?: Date;
  }): void {
    if (data.type) this._type = MovementTypeVO.fromString(data.type);
    if (data.amount !== undefined) this._amount = Money.create(data.amount);
    if (data.concept) this._concept = Concept.create(data.concept);
    if (data.date) {
      this.date = data.date;
      this.validateDate();
    }
    this.updatedAt = new Date();
    
    // Emite evento de dominio
    DomainEventDispatcher.dispatch(
      new MovementUpdatedEvent(this.id, this.userId)
    );
  }

  // Validaciones de negocio
  private validateDate(): void {
    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new Error('La fecha del movimiento debe ser válida');
    }
  }

  // Getters exponen Value Objects
  get type(): string { return this._type.value; }
  get amount(): number { return this._amount.value; }
  get concept(): string { return this._concept.value; }
}
```

**Reglas de negocio en Movement:**
1. Un movimiento DEBE tener tipo (INCOME o EXPENSE)
2. El monto debe estar entre 0.01 y 999,999,999.99
3. El concepto debe tener entre 3 y 200 caracteres
4. La fecha debe ser válida
5. Toda actualización emite un evento

---

## 2. Value Objects (Objetos de Valor)

### Definición
Objetos **sin identidad propia**, definidos por sus atributos. Dos Value Objects con los mismos valores son idénticos.

### Características
- Inmutables (no tienen setters)
- Validación automática en la creación
- Comparación por valor, no por referencia
- Pueden ser compartidos
- Lanzan errores si los datos son inválidos

### Ejemplo: Money.ts

```typescript
export class Money {
  private static readonly MIN_AMOUNT = 0.01;
  private static readonly MAX_AMOUNT = 999999999.99;

  private constructor(private readonly _value: number) {}

  static create(value: number): Money {
    // Validación de negocio
    if (value < Money.MIN_AMOUNT || value > Money.MAX_AMOUNT) {
      throw new Error(
        `El monto debe estar entre ${Money.MIN_AMOUNT} y ${Money.MAX_AMOUNT}`
      );
    }

    // Redondeo a 2 decimales
    const rounded = Math.round(value * 100) / 100;
    return new Money(rounded);
  }

  get value(): number {
    return this._value;
  }

  // Método de negocio: formatear
  format(): string {
    return this._value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
  }
}
```

**¿Por qué usar Money en vez de number?**
```typescript
// ❌ Problema sin Value Object
const amount = 0; // ¿Es válido? ¿Qué moneda? ¿Cuántos decimales?
const tooLarge = 999999999999999; // No hay validación

// ✅ Solución con Value Object
const amount = Money.create(0); // ❌ Lanza error: mínimo 0.01
const tooLarge = Money.create(999999999999999); // ❌ Lanza error: máximo superado
const valid = Money.create(100.50); // ✅ Válido
console.log(valid.format()); // "$100.50"
```

### Ejemplo: Email.ts

```typescript
export class Email {
  private static readonly MAX_LENGTH = 255;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new Error('El formato del email no es válido');
    }

    if (trimmed.length > Email.MAX_LENGTH) {
      throw new Error(`El email no puede tener más de ${Email.MAX_LENGTH} caracteres`);
    }

    return new Email(trimmed);
  }

  get value(): string {
    return this._value;
  }
}
```

### Ejemplo: Concept.ts

```typescript
export class Concept {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  private constructor(private readonly _value: string) {}

  static create(value: string): Concept {
    const trimmed = value.trim();

    if (trimmed.length < Concept.MIN_LENGTH) {
      throw new Error(`El concepto debe tener al menos ${Concept.MIN_LENGTH} caracteres`);
    }

    if (trimmed.length > Concept.MAX_LENGTH) {
      throw new Error(`El concepto no puede tener más de ${Concept.MAX_LENGTH} caracteres`);
    }

    return new Concept(trimmed);
  }

  get value(): string {
    return this._value;
  }
}
```

**Todos los Value Objects siguen el mismo patrón:**
1. Constructor privado (solo se crean con el factory `create()`)
2. Validación en el factory method
3. Inmutabilidad (solo getter, no setter)
4. Lanzan `Error` si los datos son inválidos

---

## 3. Domain Events (Eventos de Dominio)

### Definición
Representan **algo importante que ocurrió** en el dominio. Se usan para comunicación entre agregados sin crear dependencias directas.

### Ejemplo: MovementEvents.ts

```typescript
import { DomainEvent } from './DomainEvent';

export class MovementCreatedEvent extends DomainEvent {
  constructor(
    public readonly movementId: string,
    public readonly userId: string
  ) {
    super('MovementCreated');
  }
}

export class MovementUpdatedEvent extends DomainEvent {
  constructor(
    public readonly movementId: string,
    public readonly userId: string
  ) {
    super('MovementUpdated');
  }
}
```

### ¿Cuándo se emiten?

```typescript
// En Movement.ts
static create(props: {/* ... */}): Movement {
  const movement = new Movement(/* ... */);
  
  // Evento: "Se creó un movimiento"
  DomainEventDispatcher.dispatch(
    new MovementCreatedEvent(movement.id, movement.userId)
  );
  
  return movement;
}

update(data: {/* ... */}): void {
  // ... actualizar datos ...
  
  // Evento: "Se actualizó un movimiento"
  DomainEventDispatcher.dispatch(
    new MovementUpdatedEvent(this.id, this.userId)
  );
}
```

**Usos futuros:**
- Enviar email cuando se crea un movimiento
- Actualizar estadísticas en tiempo real
- Crear un log de auditoría
- Notificar a otros servicios

---

## 🎯 Reglas de Negocio Implementadas

### Movement
- ✅ Tipo debe ser `INCOME` o `EXPENSE`
- ✅ Monto entre 0.01 y 999,999,999.99
- ✅ Concepto entre 3 y 200 caracteres
- ✅ Fecha válida requerida
- ✅ Usuario propietario (userId) inmutable
- ✅ Emite eventos al crear/actualizar

### User
- ✅ Email único y válido
- ✅ Teléfono opcional (5-15 dígitos)
- ✅ Rol: ADMIN o USER
- ✅ Nombre requerido (min 2 caracteres)

### Money
- ✅ Valor mínimo: 0.01 (no hay movimientos de $0)
- ✅ Valor máximo: 999,999,999.99
- ✅ Siempre 2 decimales
- ✅ Formato colombiano con miles

### Email
- ✅ Formato RFC 5322
- ✅ Máximo 255 caracteres
- ✅ Normalización: trim + lowercase

### Phone
- ✅ Solo dígitos
- ✅ Entre 5 y 15 caracteres
- ✅ Opcional (puede ser null)

---

## ❌ Lo que NO debe estar en Domain

```typescript
// ❌ NO importar frameworks
import { PrismaClient } from '@prisma/client'; // ❌
import { NextApiRequest } from 'next'; // ❌
import express from 'express'; // ❌

// ❌ NO acceder a base de datos
prisma.movement.create(); // ❌

// ❌ NO manejar HTTP
res.status(200).json(); // ❌

// ❌ NO usar variables de entorno
process.env.DATABASE_URL; // ❌
```

---

## ✅ Testing del Domain

**Ventaja**: El Domain se testea sin base de datos, sin servidor, sin nada externo.

```typescript
describe('Money', () => {
  it('should create valid money', () => {
    const money = Money.create(100.50);
    expect(money.value).toBe(100.50);
  });

  it('should throw error for amount below minimum', () => {
    expect(() => Money.create(0)).toThrow();
  });

  it('should round to 2 decimals', () => {
    const money = Money.create(100.999);
    expect(money.value).toBe(101.00);
  });
});
```

Ver tests completos en: `__tests__/domain/`

---

## 📚 Conceptos Clave

1. **Entity vs Value Object**:
   - Entity: Tiene ID (Movement, User)
   - Value Object: Sin ID (Money, Email)

2. **Inmutabilidad**:
   - Value Objects nunca cambian
   - Entities cambian con métodos específicos

3. **Validación**:
   - Siempre en constructores/factories
   - Lanzar Error si inválido
   - Nunca crear objetos inválidos

4. **Independencia**:
   - Zero imports de capas externas
   - Solo TypeScript y lógica pura

---

## 🔗 Relación con otras capas

```
Domain ← Application ← Infrastructure ← Presentation
   ↑         ↑             ↑               ↑
  Puro    Usa Domain   Implementa      Llama todo
         interfaces    con Prisma
```

**Siguiente**: Lee `02-application-layer.md` para ver cómo se usan estas entidades en casos de uso.
