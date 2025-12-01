# Mock Data & Types

Esta carpeta contiene tipos y datos mock para el desarrollo del frontend mientras el backend está en construcción.

## Estructura

```
mock/
├── types/          # Definiciones de tipos TypeScript
│   ├── account.ts  # Tipos relacionados con cuentas
│   └── index.ts    # Exportaciones centralizadas
└── README.md       # Este archivo
```

## Por qué está aquí

Los tipos mock están separados del paquete `@repo/db` para:

1. **Desarrollo paralelo**: Permitir que el frontend avance sin depender del backend incompleto
2. **Evitar conflictos**: Prevenir cambios en el backend que rompan el frontend durante desarrollo
3. **Migración gradual**: Facilitar la transición a tipos reales cuando el backend esté listo

## Uso

Importa los tipos desde `@/mock/types`:

```typescript
import type { Account, CreateAccountInput } from "@/mock/types";
import { AccountType, AccountStatus } from "@/mock/types";
```

## Migración futura

Cuando el backend esté completo:

1. Actualizar tipos en `@repo/db` con las definiciones reales
2. Reemplazar `@/mock/types` con `@repo/db` en todo el frontend
3. Eliminar esta carpeta mock