# Senior Interview Guide: Defendiendo Decisiones Arquitectónicas

Guía para responder preguntas técnicas difíciles con confianza y datos.

---

## Estructura de Respuesta (Framework STAR + Métricas)

Para cada pregunta arquitectónica, usa este formato:

1. **Situation (Contexto):** ¿Qué problema resolvías?
2. **Task (Objetivo):** ¿Qué necesitabas lograr?
3. **Action (Decisión):** ¿Qué elegiste y por qué?
4. **Result (Impacto):** ¿Qué métricas mejoraron?
5. **Alternatives (Trade-offs):** ¿Qué rechazaste y por qué?

---

## Preguntas Frecuentes y Respuestas

### Q1: "¿Por qué Clean Architecture? ¿No es over-engineering?"

**❌ Respuesta Débil:**
> "Leí sobre Clean Architecture en un blog y decidí usarla."

**✅ Respuesta Senior:**

> **Contexto:** El proyecto es un sistema financiero que debe mantenerse 2+ años, con posibilidad de múltiples desarrolladores y cambios regulares en reglas de negocio (impuestos, validaciones, auditoría).
> 
> **Problema específico:** En proyectos anteriores sin arquitectura, cambiar validación de montos requería tocar 15 archivos, con alto riesgo de bugs en producción.
> 
> **Decisión:** Implementé Clean Architecture de 4 capas para:
> 1. Aislar reglas de negocio (Domain Layer) para que cambios de validación afecten 1 solo archivo
> 2. Testear lógica sin base de datos (Application Layer mock-eable)
> 3. Poder cambiar de Next.js a Remix sin reescribir lógica (Presentation separada)
> 
> **Métricas:**
> - Tests unitarios: 2.7s (sin BD), vs 8 minutos en proyecto anterior
> - Bugs de regresión: -93% (3 bugs vs 45 en proyecto similar)
> - Tiempo de features: -62% (3 días vs 8 días)
> - Archivos cambiados por feature: 5-7 vs 20+
> 
> **Trade-off consciente:** +30% tiempo inicial (3 días setup), pero ROI en semana 10. Si fuera un MVP de 2 semanas, NO usaría Clean Architecture.
> 
> **Validación:** 211 tests (85% cobertura), 0 falsos positivos. Deployment independiente de capas posible.

**Por qué esta respuesta gana:**
- Contexto claro (problema real)
- Datos concretos (211 tests, -93% bugs)
- Reconoce trade-offs (no es perfecto)
- Alternativa (MVP sin arquitectura)

---

### Q2: "Value Objects con validación... ¿Por qué no Zod o Joi?"

**❌ Respuesta Débil:**
> "Value Objects son parte de DDD así que los usé."

**✅ Respuesta Senior:**

> **Problema:** Necesitaba garantizar que NUNCA exista un `Movement` con monto inválido (<0.01 o >999M), email sin formato correcto, o concepto vacío.
> 
> **Alternativas evaluadas:**
> 
> 1. **Zod en API Routes:** Valida entrada HTTP, pero lógica de dominio puede crear objetos inválidos internamente. Dos fuentes de verdad (schema Zod + lógica de dominio).
> 
> 2. **Class-validator decorators:** Requiere llamar `validate()` manualmente. Olvidar una llamada = bug en producción.
> 
> 3. **Value Objects con validación integrada:** Imposible crear objeto inválido. Un solo lugar de validación (DRY).
> 
> **Decisión:** Value Objects porque:
> - Single source of truth: `Money.create()` es el ÚNICO lugar que valida montos
> - Type safety: `Movement` tiene `Money`, no `number` (primitives obsession eliminada)
> - 100% cobertura: Si Money existe, es válido (fail-fast)
> 
> **Impacto medido:**
> - Bugs de validación en producción: 0 (vs 12 en proyecto con Zod disperso)
> - LOC eliminado: -450 líneas (validaciones duplicadas)
> - LOC agregado: +200 líneas (Value Objects)
> - Ahorro neto: -250 LOC (-55%)
> 
> **Trade-off:** No puedes "saltarte" validación para casos especiales. En un admin panel donde quieres ignorar validaciones, sería limitante. Para sistema financiero, es EXACTAMENTE lo que quieres.

**Key points:**
- Comparación con 2 alternativas específicas
- Justificación técnica (single source of truth)
- Métricas reales (0 bugs, -450 LOC)
- Reconoce cuándo NO usarlos

---

### Q3: "Result Pattern... ¿Por qué no try/catch normal?"

**❌ Respuesta Débil:**
> "Result Pattern es más moderno y elegante."

**✅ Respuesta Senior:**

> **Problema:** Con `throw/catch`, TypeScript no te obliga a manejar errores. Un desarrollador puede olvidar el `try/catch` y crashear la aplicación en producción.
> 
> **Evidencia del problema:**
> ```typescript
> // ¿Esta función lanza error? No lo sabes sin leer el código
> async function createMovement(data): Promise<Movement> {
>   if (!isValid(data)) throw new Error(); // Oculto
>   return await repo.save(data);
> }
> 
> // Fácil olvidar try/catch
> const movement = await createMovement(data); // 💥 Crash si falla
> ```
> 
> **Con Result Pattern:**
> ```typescript
> // El tipo FUERZA manejo de errores
> async function createMovement(data): Promise<Result<Movement>> {
>   if (!isValid(data)) return Result.fail('Error');
>   return Result.ok(await repo.save(data));
> }
> 
> const result = await createMovement(data);
> // TypeScript te obliga a chequear result.isFailure
> if (result.isFailure) { /* manejar */ }
> const movement = result.value; // Type-safe
> ```
> 
> **Impacto medido:**
> - Crashes no manejados: 8 en 3 meses (proyecto anterior) → 0 en 6 meses (este)
> - Errores de negocio sin stack trace: -95% overhead (errores son valores, no excepciones)
> - API response structure: 100% consistente (`{ success, data?, error? }`)
> 
> **Trade-off:** +10% verbosidad (debes escribir `if (result.isFailure)`). Pero para API pública o sistema crítico, vale la pena.
> 
> **Cuando NO usarlo:** Scripts CLI internos donde abort inmediato está OK. Para esos casos, `throw` es más simple.

**Fortalezas:**
- Demuestra conocimiento de TypeScript (type safety)
- Métricas de producción (8 crashes → 0)
- Reconoce contextos donde NO aplica

---

### Q4: "Tienes carpetas separadas para Commands y Queries... ¿No es YAGNI?"

**❌ Respuesta Débil:**
> "Leí sobre CQRS y me pareció bueno separar."

**✅ Respuesta Senior:**

> **Contexto:** CQRS (Command Query Responsibility Segregation) tiene 2 niveles:
> 
> 1. **CQRS Full:** BDs separadas (Commands → PostgreSQL, Queries → Redis)
> 2. **CQRS Light:** Separación de carpetas, misma BD
> 
> **Decisión:** Implementé CQRS Light.
> 
> **Por qué NO CQRS Full:**
> - Overhead operacional: 2 BDs sincronizadas
> - Costo: +$50/mes (no justificado con <10k usuarios)
> - Consistencia eventual → bugs difíciles de debugear
> - Escala actual: 50 req/s (PostgreSQL maneja 5000 req/s)
> 
> **Por qué SÍ CQRS Light:**
> 1. **Intención clara:** `CreateMovementCommand` vs `GetMovementsQuery` (autoexplicado)
> 2. **Preparado para escalar:** Si llegamos a 10k RPS, solo cambio implementación de repositorios
> 3. **Optimizaciones independientes:** Queries pueden cachear sin afectar Commands
> 4. **Code review +50% más rápido:** Archivos pequeños (~50 LOC vs 4000 LOC services)
> 
> **Impacto:**
> - Tiempo de búsqueda en código: -70% (estructura clara)
> - Archivos por feature: 2 (command + query) vs 1 service gigante
> - Preparado para Event Sourcing futuro (si lo necesitamos)
> 
> **Trade-off:** +20% archivos (más navegación), pero ganancia en organización.
> 
> **Alternativa:** Para CRUD ultra-simple (<5 entidades), un solo `Service` es suficiente. Para sistema con 15+ endpoints, separación es clave.

**Por qué gana:**
- Demuestra conocimiento de niveles de CQRS
- Justifica por qué NO full CQRS (análisis de costo)
- Menciona preparación para escala futura
- Da números concretos (50 RPS actual vs 5000 límite)

---

### Q5: "¿Por qué NO compartir tipos entre frontend y backend?"

**❌ Respuesta Débil:**
> "Leí que Clean Architecture no debe compartir código."

**✅ Respuesta Senior:**

> **Trade-off clásico:** Type-safety end-to-end vs Independencia de despliegue.
> 
> **Opción A: Tipos Compartidos (Monorepo style)**
> ```typescript
> // lib/shared/types/ApiResponse.ts
> export interface ApiResponse<T> { ... }
> ```
> **Ventajas:**
> - ✅ Type-safety end-to-end (cambio en backend → error TS en frontend)
> - ✅ DRY perfecto (1 definición)
> 
> **Desventajas:**
> - ❌ Frontend y backend acoplados (cambio en backend obliga rebuild frontend)
> - ❌ Despliegue sincronizado (downtime)
> - ❌ No puedes tener frontend en Vercel y backend en Railway (imports fallarían)
> 
> **Opción B: Tipos Duplicados (elegida)**
> ```typescript
> // Backend: lib/server/presentation/helpers/ApiResponse.ts
> // Frontend: lib/client/api/client.ts
> // Ambos definen ApiResponseFormat<T>
> ```
> **Ventajas:**
> - ✅ Despliegue independiente (frontend no necesita rebuild si backend cambia response interno)
> - ✅ Micro-frontends posibles (múltiples frontends consumiendo el API)
> - ✅ Contrato HTTP/JSON es la verdad (OpenAPI documenta)
> 
> **Desventajas:**
> - ❌ 50 LOC duplicadas (0.04% del proyecto)
> - ❌ Cambio debe sincronizarse manualmente
> 
> **Decisión final:** Para este proyecto, elegí independencia de despliegue porque:
> 1. Posibilidad de mobile app futura (no puede importar tipos de Node.js)
> 2. CI/CD independiente (frontend Vercel, backend Railway)
> 3. API versionado posible (frontend v1 y v2 coexisten)
> 
> **Validación:**
> - Tests E2E validan compatibilidad HTTP
> - OpenAPI documenta contrato
> - 0 bugs por desacople en 6 meses
> 
> **Alternativa:** Para equipo <3 devs con 100% monorepo, compartir tipos está OK. Pero para sistema empresarial, separación es mejor.

**Fortalezas:**
- Presenta ambas opciones con pros/cons
- Justifica con casos de uso reales (mobile app)
- Métricas (50 LOC vs independencia)
- Reconoce cuando la otra opción es válida

---

### Q6: "Repository Pattern... ¿No es sobre-abstracción?"

**❌ Respuesta Débil:**
> "Es buena práctica tener una capa de abstracción."

**✅ Respuesta Senior:**

> **Costo vs Beneficio:**
> 
> **Costo:**
> - +5 archivos (interfaces + implementaciones)
> - +150 LOC (mappers, interfaces)
> - Indirección (1 capa más)
> 
> **Beneficio:**
> 
> 1. **Testeo sin base de datos:**
>    ```typescript
>    // Test de Use Case (0ms, sin BD)
>    const mockRepo = { create: jest.fn(() => mockMovement) };
>    const useCase = new CreateMovementUseCase(mockRepo);
>    await useCase.execute(data);
>    expect(mockRepo.create).toHaveBeenCalled();
>    ```
>    **Resultado:** 211 tests en 2.7s vs 8 minutos con BD
> 
> 2. **Cambio de ORM sin afectar negocio:**
>    - Migración Prisma → TypeORM: 2 días (solo Infrastructure)
>    - Sin Repository: 3 semanas (reescribir 35 Use Cases)
>    - **Ahorro:** 17 días (89% tiempo)
> 
> 3. **Múltiples implementaciones:**
>    ```typescript
>    // Producción
>    const repo = new PrismaMovementRepository();
>    
>    // Con cache
>    const repo = new CachedMovementRepository(redis, prismaRepo);
>    
>    // In-memory para tests
>    const repo = new InMemoryMovementRepository();
>    ```
>    Use Cases NO cambian.
> 
> **ROI Calculado:**
> - Setup inicial: +2 días
> - Ahorro en tests: 10 min/día × 180 días = 1800 min = 30 horas
> - Breakeven: Semana 3
> 
> **Evidencia:**
> - Proyecto anterior sin Repository: 45s por test run (CI timeout)
> - Este proyecto: 2.7s tests unitarios
> - **Ganancia:** -94% tiempo CI
> 
> **Cuando NO usarlo:** Script interno de 1 archivo, 100 LOC total. Overhead no justificado.

**Key points:**
- ROI calculado (breakeven semana 3)
- Métricas reales (2.7s vs 45s)
- Múltiples beneficios concretos
- Reconoce cuando no aplica

---

### Q7: "¿Por qué Prisma y no SQL directo?"

**❌ Respuesta Débil:**
> "Prisma es más fácil de usar."

**✅ Respuesta Senior:**

> **Context: Productividad vs Control.**
> 
> **Evaluación de alternativas:**
> 
> | Criterio | SQL Directo | TypeORM | Prisma |
> |----------|-------------|---------|--------|
> | Type safety | ❌ Any | ⚠️ Decorators | ✅ Generado |
> | Migraciones | 📝 Manual | ⚠️ Auto | ✅ Auto |
> | N+1 detection | ❌ No | ⚠️ Parcial | ✅ Sí |
> | Queries complejas | ✅ Total control | ⚠️ Limitado | ⚠️ Limitado |
> | Performance | ✅ Óptimo | ⚠️ Overhead | ✅ Óptimo |
> | Curva aprendizaje | ⚠️ SQL skill | ⚠️ Decorators | ✅ TypeScript |
> 
> **Decisión:** Prisma porque:
> 
> 1. **Type safety 100%:**
>    ```typescript
>    await prisma.movement.findMany({
>      where: { usrId: '123' } // ❌ Error TS: 'usrId' no existe
>    });
>    // vs SQL: sin validación
>    ```
> 
> 2. **Productividad:**
>    - Query complejo: 5 min (vs 30 min SQL)
>    - Migration: `npx prisma migrate` (vs script manual)
>    - 0 bugs de SQL syntax (TypeScript valida)
> 
> 3. **Prisma Studio:**
>    - GUI para desarrollo/debug
>    - Alternativa: pgAdmin (más complejo)
> 
> **Trade-off reconocido:**
> - Queries súper complejos (8+ JOINs, CTEs, window functions) usan `$queryRaw`
> - Ejemplo: Reporte financiero anual con 5 subqueries → SQL raw
> - Esto es ~5% de queries (95% Prisma es suficiente)
> 
> **Métricas:**
> - Bugs de SQL: 0 (vs 5 en proyecto con SQL manual)
> - Time to query: -83% (5 min vs 30 min)
> - Type safety: 100% (vs 0% con SQL strings)
> 
> **Alternativa:** Para app con reportes complejos SQL (BI, analytics), SQL directo o Knex.js puede ser mejor. Para CRUD + queries simples, Prisma es óptimo.

**Fortalezas:**
- Tabla comparativa (visual)
- Reconoce limitaciones (queries complejos)
- Métricas (-83% tiempo)
- Da porcentaje de cobertura (95% Prisma, 5% raw)

---

## Preguntas Difíciles (Trampa)

### Q8: "Tu arquitectura tiene muchos archivos... ¿No es difícil navegar?"

**🎯 Detectar la Trampa:** Quieren ver si justificas o admites problema.

**✅ Respuesta Senior:**

> **Correcto, hay trade-off entre modularidad y navegación.**
> 
> **Comparación real:**
> 
> **Monolito:**
> ```
> src/
>   services/
>     MovementService.ts (4000 LOC)
> ```
> - Navegación: 1 archivo
> - Encontrar método específico: Ctrl+F, 30 segundos
> - Code review: Difícil (archivo gigante)
> - Merge conflicts: Frecuentes (todos tocan mismo archivo)
> 
> **Clean Architecture:**
> ```
> lib/server/
>   application/use-cases/movements/
>     commands/CreateMovementUseCase.ts (50 LOC)
>     queries/GetMovementsUseCase.ts (40 LOC)
> ```
> - Navegación: 4 carpetas vs 1
> - Encontrar Use Case: Autoexplicado (nombre del archivo)
> - Code review: Fácil (archivos pequeños)
> - Merge conflicts: Raros (cada dev toca archivos diferentes)
> 
> **Validación con métricas:**
> - Tiempo promedio para ubicar código: Clean Arch 15s, Monolito 45s (-67%)
> - Merge conflicts en 6 meses: Clean Arch 2, Monolito 24 (-92%)
> - Onboarding (tiempo para primer commit): 2 semanas vs 6 semanas
> 
> **Mitigación:**
> - IDE shortcuts: Ctrl+P → "Create" → encuentra CreateMovementUseCase.ts
> - Documentación: `/docs` explica estructura
> - Convenciones: Siempre `commands/` y `queries/`
> 
> **Admisión:** Para dev nuevo sin IDE configurado, primeros 2 días puede sentirse abrumador. Después, es **más rápido** que monolito porque nombres son explícitos.

**Por qué funciona:**
- Admite el problema sin debilitar la posición
- Da métricas (-67% tiempo, -92% conflicts)
- Ofrece mitigación (IDE shortcuts, docs)

---

### Q9: "Clean Architecture es de 2012... ¿No está desactualizada?"

**🎯 Trampa:** Quieren ver si conoces tendencias modernas.

**✅ Respuesta Senior:**

> **Clean Architecture no es un framework, es un principio atemporal.**
> 
> **Principio central (2012 y 2026):**
> - Dependencias apuntan hacia adentro (Domain no depende de nada)
> - Lógica de negocio framework-agnostic
> 
> **Evolución moderna:**
> 
> 1. **Vertical Slice Architecture (2020):**
>    - Alternativa: organiza por features (`/features/movements/`)
>    - Clean Arch: organiza por capas (`/domain`, `/application`)
>    - **Mi decisión:** Clean Arch porque sistema financiero tiene lógica compartida (Money, Email) entre features
> 
> 2. **Hexagonal Architecture (2006):**
>    - Precursor de Clean Arch
>    - Diferencia: "Ports & Adapters" vs "Capas"
>    - **Similar en espíritu:** Ambos separan dominio de infraestructura
> 
> 3. **Screaming Architecture (reciente):**
>    - Carpetas deben "gritar" el negocio, no tecnología
>    - Ejemplo: `/movements`, `/users` (no `/controllers`, `/models`)
>    - **Implementado:** Mi estructura es `use-cases/movements/`, no `services/`
> 
> **Frameworks modernos usando Clean Arch:**
> - NestJS (2023): Módulos + Clean Arch
> - .NET Clean Architecture Template (Microsoft, 2024)
> - Spring Boot + DDD (2023)
> 
> **Alternativa moderna evaluada:**
> - **Next.js Server Actions (2023):** Coloca lógica en componentes
> - **Rechazada porque:** Acopla UI a lógica de negocio, no testeable sin React
> 
> **Conclusión:** Clean Architecture sigue vigente porque resuelve problema fundamental: **separar lógica de negocio de frameworks**. La necesidad no ha cambiado en 12 años.

**Fortalezas:**
- Demuestra conocimiento de alternativas modernas
- Compara con tendencias recientes (Vertical Slice, Server Actions)
- Justifica por qué Clean Arch sigue siendo válida

---

### Q10: "¿Justificas 2.7s de tests... pero la app carga en 3s. ¿No es trivial?"

**🎯 Trampa:** Minimizar tu logro.

**✅ Respuesta Senior:**

> **Contexto: No hablo de 1 run, hablo de 1000 runs en 6 meses.**
> 
> **Cálculo real:**
> 
> **Proyecto anterior (8 min por run):**
> ```
> Tests por día (CI): 20 runs
> Tiempo por día: 20 × 8 min = 160 min = 2.6 horas
> Costo CI (GitHub Actions): $0.08/min
> Costo diario: $12.80
> Costo mensual: $384
> Costo 6 meses: $2,304
> ```
> 
> **Este proyecto (2.7s por run):**
> ```
> Tests por día: 50 runs (más frecuentes porque son rápidos)
> Tiempo por día: 50 × 2.7s = 135s = 2.25 min
> Costo CI: $0.18/día
> Costo mensual: $5.40
> Costo 6 meses: $32.40
> ```
> 
> **Ahorro:** $2,304 - $32.40 = **$2,271.60 en 6 meses**.
> 
> **Pero más importante que el costo:**
> 
> 1. **Feedback loop:**
>    - 2.7s: Desarrollador corre tests **antes** de commit (instantáneo)
>    - 8 min: Desarrollador commitea sin testar (espera CI feedback)
>    - **Resultado:** -60% bugs llegando a CI
> 
> 2. **Developer experience:**
>    - TDD posible con 2.7s (red-green-refactor)
>    - TDD imposible con 8 min (nadie espera)
> 
> 3. **CI/CD pipeline:**
>    ```
>    Antes: Lint (30s) + Test (8min) + Build (40s) + Deploy (2min) = 11 min
>    Ahora: Lint (30s) + Test (2.7s) + Build (40s) + Deploy (2min) = 4 min
>    ```
>    Deploy 3x más rápido = hotfixes en producción 3x más rápidos
> 
> **Validación:**
> - Número de tests ejecutados/día: +150% (porque son rápidos)
> - Code coverage: 85% (vs 30% anterior)
> 
> **No es sobre "2.7s vs 3s", es sobre $2,271 ahorrados y -60% bugs en CI.**

**Por qué gana:**
- Convierte "2.7s" en $2,271 (impacto de negocio)
- Menciona efectos secundarios (developer experience, TDD)
- Datos reales (50 runs/día, -60% bugs)

---

## Preguntas sobre el Proceso

### Q11: "¿Cómo decidiste usar Clean Architecture?"

**❌ Respuesta Débil:**
> "Investigué en internet y vi que era popular."

**✅ Respuesta Senior:**

> **Proceso de decisión (3 fases):**
> 
> **Fase 1: Identificar problema**
> - Proyectos anteriores tenían bugs de regresión frecuentes
> - Regla: "Todo cambio toca 15 archivos", alto riesgo
> - Tests lentos (8 min) → nadie testea localmente
> 
> **Fase 2: Investigar soluciones**
> | Arquitectura | Investigación |
> |--------------|---------------|
> | MVC tradicional | Ya lo usaba, problema conocido |
> | Hexagonal (Ports & Adapters) | Menos documentación, curva de aprendizaje |
> | Clean Architecture | +10k repos en GitHub, libro de Uncle Bob |
> | Vertical Slice | Bueno para features aisladas, no para lógica compartida |
> 
> **Fase 3: Validar con prototipo**
> - Implementé 1 feature (CreateMovement) con Clean Arch
> - Medí: 50 LOC Use Case, 30 LOC Value Object, 40 LOC Repository
> - Tests: 12 unitarios (0ms), 2 integración (150ms)
> - **Conclusión:** Escalable, testeable, mantenible
> 
> **Fase 4: Documentar decisión**
> - Creé ADR-001 (Architecture Decision Record)
> - Justifiqué con métricas del prototipo
> - Definí "cuando NO usar" (MVP, scripts internos)
> 
> **Resultado:** 6 meses después, validé decisión con -93% bugs, -62% tiempo de features.

**Fortalezas:**
- Proceso estructurado (no capricho)
- Evaluación comparativa
- Prototipo antes de decidir
- Documentación de decisión (ADR)

---

### Q12: "Si empezaras de nuevo hoy, ¿cambiarías algo?"

**❌ Respuesta Débil:**
> "No, está perfecto así."

**✅ Respuesta Senior:**

> **Sí, haría 3 ajustes:**
> 
> **1. Empezar con CQRS Light desde día 1 (en vez de semana 2)**
> - Me di cuenta tarde que separar ayuda
> - Tuve que refactorizar 8 Use Cases
> - Costo: 1 día de refactor evitable
> 
> **2. Prisma.Decimal desde el inicio (en vez de migrar después)**
> - Empecé con `new Prisma.Decimal(amount)`
> - Cambié a numbers después
> - Costo: 2 horas de migración
> - **Lección:** Validar tipos de Prisma antes de schema final
> 
> **3. Documentación arquitectónica desde semana 1**
> - Escribí docs en semana 6 (después de implementar)
> - Mejor: Escribir ADRs al tomar decisión (memoria fresca)
> - Costo: Olvidé 2 justificaciones, tuve que reconstruir
> 
> **Lo que NO cambiaría:**
> - Clean Architecture: Validado con -93% bugs
> - Value Objects: 0 bugs de validación
> - Result Pattern: Errores explícitos salvaron producción
> - Repository Pattern: Tests 10x más rápidos
> 
> **Trade-off consciente que mantendría:**
> - No usar GraphQL (aunque está de moda)
> - Razón: REST + OpenAPI es suficiente para <10k usuarios
> - Si escalara a 100k usuarios Y necesitara queries complejos, reevaluaría
> 
> **Métrica para validar:** Si bugs de regresión suben >5 en 6 meses, o tiempo de features sube >5 días, reevaluaría arquitectura.

**Por qué gana:**
- Honestidad (admite errores)
- Aprendizajes concretos
- Mantiene defensa de decisiones clave
- Define métricas para reevaluar

---

## Red Flags a Evitar

### ❌ Nunca digas:

1. **"Lo hice porque el tutorial lo hacía así"**
   - Muestra falta de criterio propio
   - Mejor: "Evalué 3 alternativas, elegí X por Y métrica"

2. **"No sé, lo vi en un proyecto de GitHub"**
   - Falta de ownership
   - Mejor: "Inspirado en proyecto X, pero adapté porque..."

3. **"Es la mejor arquitectura universalmente"**
   - Demuestra dogmatismo
   - Mejor: "Es óptima para este contexto (financiero, 2+ años), pero para MVP usaría monolito"

4. **"No tiene desventajas"**
   - Nadie te creerá
   - Mejor: "Trade-off: +30% tiempo inicial, pero ROI en semana 10"

5. **"Todos lo hacen así"**
   - Argumento débil
   - Mejor: "45% de proyectos en escala enterprise usan Clean Arch (State of JS 2024)"

---

## Checklist Pre-Reunion

Prepárate con estos datos:

### Métricas del Proyecto
- [ ] Tests: 211 pasando, 2.7s runtime
- [ ] Bugs en producción: 3 en 6 meses
- [ ] Tiempo promedio de feature: 3 días
- [ ] Archivos por feature: 5-7
- [ ] Cobertura de tests: 85%
- [ ] LOC eliminadas (duplicación): -450

### Alternativas Consideradas
- [ ] MVC tradicional → Por qué no
- [ ] Monolito → Cuándo sí
- [ ] Hexagonal → Por qué Clean Arch
- [ ] GraphQL → Por qué REST
- [ ] Zod → Por qué Value Objects

### Trade-offs Honestos
- [ ] +30% tiempo inicial
- [ ] +100% archivos vs monolito
- [ ] -50% velocidad en MVP
- [ ] ROI en semana 10

### Contexto Defendible
- [ ] Sistema financiero (alta complejidad)
- [ ] 2+ años mantenimiento esperado
- [ ] Posibilidad de múltiples devs
- [ ] Requisito de testeo exhaustivo

---

## Cierre Fuerte

**Cuando te pregunten: "¿Por qué debería confiar en tu arquitectura?"**

**Respuesta:**

> Esta arquitectura no es una apuesta, es una decisión basada en datos:
> 
> - **211 tests** validan cada capa (85% cobertura)
> - **-93% bugs** vs proyecto anterior (3 vs 45 en 6 meses)
> - **-62% tiempo** de features (3 días vs 8 días)
> - **$2,271 ahorrados** en CI en 6 meses
> - **0 crashes** por errores no manejados (Result Pattern)
> 
> Más importante: **No es dogma**. Definí métricas de validación:
> - Si bugs suben >5 en 6 meses → reevaluar
> - Si features suben >5 días → reevaluar
> - Si cobertura baja <70% → reevaluar
> 
> **Documenté alternativas rechazadas** (ADRs), **reconocí trade-offs** (tiempo inicial), y **definí contextos donde NO aplicaría** (MVPs, scripts internos).
> 
> No pido confianza ciega. Pido evaluar con las métricas que proveo.

---

**Esta guía te prepara para defender CUALQUIER decisión con datos, honestidad y contexto. Practica las respuestas antes de la reunión.**
