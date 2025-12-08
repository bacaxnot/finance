# Frontend Development TODO

> Historias de usuario y tareas de desarrollo frontend para la aplicación de finanzas personales.
> Basado en el documento de planificación del negocio.
> Nota de diseño: evitar componentes tipo "card"; usar superficies planas, listas y paneles simples.

---

## 🚨 Plan de resolución – Hallazgos QA (Severidad Alta)

### 1. Página raíz muestra boilerplate (Issue #1)
- [ ] **Redirección/Remplazo de `/`**  
  - Definir si `/` debe redirigir permanentemente a `/landing` o renderizar el landing directamente.  
  - Ajustar `app/page.tsx` o configurar middleware/redirect según la decisión.
- [ ] **Revisar navegación global**  
  - Verificar que cualquier enlace al home (navbar, footer, etc.) lleve al destino correcto tras el cambio.
- [ ] **Smoke test**  
  - Levantar la app y confirmar que visitar `/` muestra la landing real sin errores.

### 2. Filtros “All” no funcionan (Issue #3)
- [ ] **Integrar botón de filtros en el header de Accounts**  
  - Revisar `apps/web/src/app/(auth)/(dashboard)/accounts/page.tsx` y definir la nueva estructura del header para que el ícono de filtros conviva con el botón Back/título, tanto en desktop como en mobile.  
  - Crear un `Button` solamente con el ícono `Filter`, con `aria-label` y tamaño ≥44px, y elevar el estado de apertura/cierre del panel de filtros al nivel de `AccountsPage`.
- [ ] **Actualizar `AccountFilters` para ser controlado externamente**  
  - Añadir props (`isOpen`, `onOpenChange`, `triggerHidden`, etc.) para que el sheet móvil pueda abrirse desde el nuevo botón del header y ocultar el trigger interno cuando no sea necesario.  
  - Mantener el layout inline en desktop y asegurarse de que las opciones “All” usen `""` → `undefined` al guardarse en los handlers.
- [ ] **Resincronizar estado y limpiar valores**  
  - Implementar `useEffect` para que `localFilters` refleje cualquier cambio realizado desde `AccountsPage` (botón Clear, combinaciones de filtros).  
  - Normalizar los handlers para evitar que el string `"all"` llegue al API (convertir a `undefined` antes de guardar).
- [ ] **QA y accesibilidad**  
  - Probar en mobile/desktop que el nuevo botón abre/cierra el panel correctamente, combinando filtros, usando el botón Clear y aplicando los cambios.  
  - Validar focus management (teclado/esc) y lectura por screen reader del nuevo botón.

### 3. Modal de edición no persiste cambios (Issue #5)
- [ ] **Integrar `useUpdateAccount`**  
  - Conectar el formulario de edición con la mutación y manejar estados de carga/error.  
  - Invalidate queries necesarias tras éxito (ya gestionado por el hook).
- [ ] **Reset de formulario al cambiar de cuenta**  
  - Usar `form.reset` o key única para evitar valores obsoletos.
- [ ] **Pruebas manuales**  
  - Editar múltiples cuentas para validar que los cambios se reflejan en lista y tabla.

### 4. API de actualización no modifica `balance` (Issue #7)
- [ ] **Actualizar `accountsApi.updateAccount`**  
  - Mapear `input.initialBalance` hacia `balance` (o cambiar el schema para editar `balance`).  
  - Garantizar que las fechas `updatedAt` se mantengan correctas.
- [ ] **Alinear tipos/DTOs**  
  - Revisar `UpdateAccountInput` para que represente los campos realmente editables.  
  - Ajustar `AccountForm` si es necesario (por ejemplo, renombrar campo a `balance`).
- [ ] **Regresión**  
  - Crear y editar cuentas verificando que los balances actuales cambian y se reflejan en la vista consolidada.

---

## 🎯 MVP - Primera Iteración

### Epic 1 - Configuration, Security & Personalization

#### ✅ US-002 - Authentication & Data Privacy

**Frontend Tasks:**

- [ ] **Login Page**
  - Componente de formulario con email + password
  - Validación de campos (formato email, password mínimo)
  - Manejo de estados (loading, error, success)
  - Error messaging claro y accesible
  - Soporte para SSO (preparar UI, implementación futura)

- [ ] **Protected Routes**
  - HOC o middleware para proteger rutas privadas
  - Redirect a login si no autenticado
  - Manejo de sesión expirada

- [ ] **Session Management UI**
  - Indicator de sesión activa en header/navbar
  - Modal de confirmación antes de auto-logout por inactividad
  - Botón de logout visible y accesible

**Componentes a crear:**
- `LoginForm.tsx`
- `ProtectedRoute.tsx`
- `SessionIndicator.tsx`
- `LogoutButton.tsx`

**Prioridad:** 🔴 Crítica (bloqueante para acceso)

---

### Epic 2 - Unified View of Accounts & Balances

#### ✅ US-003 - Connect and Model All My Accounts

**Frontend Tasks:**

- [ ] **Account List View**
  - Tabla/Grid de cuentas con: nombre, tipo, currency, balance
  - Iconos por tipo de cuenta (checking, savings, credit card, loan, etc.)
  - Estados visuales: activa vs. archivada
  - Filtros por tipo de cuenta
  - Search bar para buscar cuentas por nombre

- [ ] **Create/Edit Account Form**
  - Modal o página para crear cuenta nueva
  - Campos: name, type (dropdown), currency (dropdown), initial balance
  - Validación: nombre requerido, balance numérico
  - Preview del tipo de cuenta seleccionado
  - Confirmación de creación exitosa (toast/notification)

- [ ] **Archive Account Action**
  - Botón de archivar en cada cuenta
  - Modal de confirmación antes de archivar
  - Visual feedback (cuenta se mueve a sección "Archived")

**Componentes a crear:**
- `AccountList.tsx`
- `AccountListItem.tsx` (layout plano sin cards)
- `AccountForm.tsx` (crear/editar)
- `AccountTypeIcon.tsx`
- `ArchiveAccountModal.tsx`

**Prioridad:** 🔴 Crítica

---

#### ✅ US-004 - Global Balance Overview

**Frontend Tasks:**

- [ ] **Dashboard Principal**
  - Bloques horizontales sin cards para métricas principales:
    - Total Cash & Liquid Assets
    - Total Debt
    - Total Receivables (dinero que me deben)
    - Net Worth
  - Visualización clara con colores (verde para assets, rojo para debts)
  - Animaciones suaves al cargar números
  - Responsive design (mobile-first)

- [ ] **Account Breakdown Section**
  - Lista expandible/colapsable por categoría de cuenta
  - Gráfico de dona/pie chart mostrando distribución
  - Hover tooltips con detalles

**Componentes a crear:**
- `Dashboard.tsx`
- `MetricStat.tsx` (unidad visual sin card styles)
- `AccountBreakdown.tsx`
- `BalanceChart.tsx`

**Prioridad:** 🔴 Crítica

---

#### ✅ US-005 - Per-Account Balance View

**Frontend Tasks:**

- [ ] **Account Detail Page**
  - Header con nombre de cuenta, tipo, balance actual
  - Botón de editar cuenta
  - Sección de estadísticas (total in, total out, avg transaction)

- [ ] **Transaction List (within account)**
  - Lista de últimas N transacciones
  - Columnas: fecha, descripción, categoría, monto
  - Paginación o infinite scroll
  - Color coding: income (verde), expense (rojo), transfer (azul)

- [ ] **Filters Section**
  - Date range picker
  - Transaction type filter (income/expense/transfer)
  - Reset filters button

**Componentes a crear:**
- `AccountDetailPage.tsx`
- `AccountHeader.tsx`
- `AccountTransactionList.tsx`
- `TransactionFilters.tsx`
- `DateRangePicker.tsx`

**Prioridad:** 🔴 Crítica

---

### Epic 3 - Unified Transaction Feed

#### ✅ US-006 - Global Transaction Feed

**Frontend Tasks:**

- [ ] **Global Transactions Page**
  - Tabla de todas las transacciones cross-account
  - Columnas: date, description, account, category, amount
  - Sorting por cualquier columna
  - Row highlighting al hover
  - Mobile view con filas apiladas (sin cards)

- [ ] **Smart Search/Filter Input**
  - Input único que filtra inteligentemente
  - Search por: account name, category, description, amount, date
  - Visual chips/tags mostrando filtros activos
  - Clear filters button
  - Debounced search (no request en cada keystroke)

- [ ] **Filter Indicators**
  - Chips visuales mostrando filtros aplicados
  - Click en chip para remover filtro individual
  - Contador de resultados encontrados

**Componentes a crear:**
- `GlobalTransactionsPage.tsx`
- `TransactionTable.tsx`
- `SmartSearchInput.tsx`
- `FilterChips.tsx`
- `TransactionRow.tsx` (desktop)
- `TransactionListItemMobile.tsx`

**Prioridad:** 🔴 Crítica

---

#### ✅ US-007 - Manual Transaction Creation

**Frontend Tasks:**

- [ ] **Create Transaction Form**
  - Modal o slide-over panel
  - Campos: date, account (dropdown), amount, type (income/expense/transfer), description, category
  - Validación en tiempo real
  - Preview del impacto en balance
  - Success feedback al crear

- [ ] **Edit Transaction Modal**
  - Pre-llenar form con datos existentes
  - Mostrar diferencia antes/después en balance
  - Confirmación antes de guardar

- [ ] **Delete Transaction**
  - Confirmación con advertencia del impacto
  - Undo option (toast con undo button, 5 segundos)

**Componentes a crear:**
- `TransactionForm.tsx`
- `CreateTransactionModal.tsx`
- `EditTransactionModal.tsx`
- `DeleteConfirmationModal.tsx`
- `BalancePreview.tsx`

**Prioridad:** 🔴 Crítica

---

#### ✅ US-008 - Internal Transfers Between Accounts

**Frontend Tasks:**

- [ ] **Transfer Form**
  - Source account dropdown
  - Destination account dropdown
  - Amount input
  - Date picker
  - Description/notes
  - Visual flow diagram (source → destination)
  - Validación: source ≠ destination, balance suficiente

- [ ] **Transfer Visualization**
  - En transaction list, mostrar transferencias con icono especial
  - Link entre transacciones relacionadas (from/to)
  - Click en transfer muestra ambas cuentas afectadas

**Componentes a crear:**
- `TransferForm.tsx`
- `TransferFlowDiagram.tsx`
- `TransferIndicator.tsx`

**Prioridad:** 🔴 Crítica

---

### Epic 4 - Bank Statement Upload & AI Extraction

#### ✅ US-009 - Upload Bank Statement File

**Frontend Tasks:**

- [ ] **Upload Zone**
  - Drag & drop area
  - File type validation (PDF, CSV)
  - File size limit indicator
  - Preview del archivo antes de upload
  - Progress bar durante upload

- [ ] **Account Selection**
  - Dropdown para seleccionar cuenta asociada
  - Validación: cuenta debe estar seleccionada antes de upload

- [ ] **Upload Status List**
  - Lista de archivos subidos
  - Estados: pending, processing, processed, failed
  - Retry button para failed uploads
  - Download original file option

**Componentes a crear:**
- `FileUploadZone.tsx`
- `UploadProgress.tsx`
- `UploadStatusList.tsx`
- `UploadStatusBadge.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

#### ✅ US-010 - AI-Based Transaction Extraction

**Frontend Tasks:**

- [ ] **Review Screen**
  - Tabla de transacciones extraídas
  - Editable cells (inline editing)
  - Checkbox para seleccionar cuáles aceptar
  - Bulk actions: select all, deselect all
  - Highlight de campos con baja confianza (AI uncertainty)

- [ ] **Individual Transaction Edit**
  - Inline editing de: date, description, amount, type
  - Validation warnings si algo parece incorrecto
  - AI confidence score indicator

- [ ] **Confirmation Flow**
  - Summary de X transacciones a crear
  - Impacto total en balance de la cuenta
  - Bulk accept button
  - Loading state durante guardado

**Componentes a crear:**
- `ExtractionReviewScreen.tsx`
- `EditableTransactionTable.tsx`
- `ConfidenceIndicator.tsx`
- `BulkActionsBar.tsx`
- `ExtractionSummary.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

### Epic 6 - Credit Card Tracking

#### ✅ US-014 - Model Credit Cards

**Frontend Tasks:**

- [ ] **Credit Card Form**
  - Extensión de Account Form con campos adicionales:
    - Credit limit
    - Closing date (día del mes)
    - Due date (día del mes)
    - Interest rate
  - Visual preview de billing cycle
  - Validación: closing date < due date

**Componentes a crear:**
- `CreditCardForm.tsx`
- `BillingCyclePreview.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

#### ✅ US-015 - Track Credit Card Transactions

**Frontend Tasks:**

- [ ] **Credit Card Detail View**
  - Similar a Account Detail pero específico para tarjetas
  - Muestra: available credit, current balance, statement balance
  - Visual progress bar: used vs. limit
  - Categorización de gastos

**Componentes a crear:**
- `CreditCardDetailPage.tsx`
- `CreditUsageBar.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

#### ✅ US-017 - Record Credit Card Payments

**Frontend Tasks:**

- [ ] **Payment Form**
  - Source account dropdown (bank accounts only)
  - Credit card dropdown
  - Amount (con suggestion: full balance, minimum payment)
  - Date
  - Confirmation de impacto en ambas cuentas

- [ ] **Payment History**
  - Lista de pagos históricos
  - Timeline visual de pagos

**Componentes a crear:**
- `CreditCardPaymentForm.tsx`
- `PaymentSuggestions.tsx`
- `PaymentHistory.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

### Epic 7 - Loans I've Given

#### ✅ US-018 - Create Loans I've Given

**Frontend Tasks:**

- [ ] **Loan Creation Form**
  - Borrower name
  - Principal amount
  - Start date
  - Interest configuration (none, fixed, variable)
  - Notes/description

**Componentes a crear:**
- `LoanForm.tsx`
- `InterestConfigSection.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

#### ✅ US-021 - Record Payments for Loans

**Frontend Tasks:**

- [ ] **Loan Payment Form**
  - Loan selection
  - Payment amount
  - Payment date
  - Payment source (bank account)
  - Allocation: interest first vs. principal first
  - Preview: remaining balance after payment

**Componentes a crear:**
- `LoanPaymentForm.tsx`
- `PaymentAllocationSelector.tsx`
- `RemainingBalancePreview.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

#### ✅ US-022 - Loan Overview

**Frontend Tasks:**

- [ ] **Loans List Page**
  - Tabla/lista plana (sin cards) con: borrower, principal, paid, accrued interest, remaining, last payment
  - Filter: active vs. fully repaid
  - Sort por: amount, date, borrower name
  - Click en loan para ver detalle

- [ ] **Loan Detail Page**
  - Header con borrower info y totals
  - Payment timeline
  - Interest calculation history
  - Action buttons: record payment, edit loan, mark as paid

**Componentes a crear:**
- `LoansListPage.tsx`
- `LoanListItem.tsx`
- `LoanDetailPage.tsx`
- `PaymentTimeline.tsx`

**Prioridad:** 🔴 Crítica (MVP)

---

## 🎨 UI/UX Components Library (Shared)

### Core Components

- [ ] **Button**
  - Variants: primary, secondary, danger, ghost
  - Sizes: sm, md, lg
  - States: default, hover, active, disabled, loading

- [ ] **Input**
  - Text, number, email, password
  - Error states
  - Helper text
  - Prefix/suffix icons

- [ ] **Select/Dropdown**
  - Single select
  - Multi-select (para filtros)
  - Searchable
  - Grouped options

- [ ] **Modal**
  - Base modal component
  - Sizes: sm, md, lg, xl, full
  - Close on overlay click
  - Keyboard navigation (ESC to close)

- [ ] **Toast/Notification**
  - Success, error, warning, info variants
  - Auto-dismiss
  - Action buttons (undo)
  - Queue management

- [ ] **Table**
  - Sortable columns
  - Sticky header
  - Row selection
  - Responsive (mobile stacked view sin cards)
  - Loading skeleton

- [ ] **Surface/Panel**
  - Contenedor simple sin estética de card
  - Variantes: flat, bordered suave

- [ ] **Badge**
  - Status indicators
  - Colors: success, error, warning, info, neutral

- [ ] **DatePicker**
  - Single date
  - Range picker
  - Min/max dates
  - Locale support (COP format)

- [ ] **Chart Components**
  - Line chart (net worth timeline)
  - Pie/Donut chart (account breakdown)
  - Bar chart (spending by category)

**Prioridad:** 🟡 Alta (necesarias para MVP)

---

## 🚀 Post-MVP - Siguientes Iteraciones

### Epic 5 - Savings & Interest-Bearing Accounts

#### US-012 - Model Interest-Bearing Accounts

**Frontend Tasks:**

- [ ] Interest configuration form
- [ ] Interest rate input con preview de earnings
- [ ] Frequency selector (daily/monthly)
- [ ] Capitalization toggle

#### US-013 - Track Periodic Contributions

**Frontend Tasks:**

- [ ] Savings contributions timeline chart
- [ ] Monthly breakdown view
- [ ] Goal tracking UI (opcional)

**Prioridad:** 🟢 Post-MVP

---

### Epic 4 (Extended) - Advanced Upload Features

#### US-011 - Duplicate Detection

**Frontend Tasks:**

- [ ] Duplicate warning modal
- [ ] Side-by-side comparison de transacciones
- [ ] Merge/ignore/create anyway options
- [ ] Bulk duplicate resolution

**Prioridad:** 🟢 Post-MVP

---

### Epic 8 - Insights & Reporting

#### US-023 - Category-Based Breakdown

**Frontend Tasks:**

- [ ] Spending by category chart (pie/bar)
- [ ] Monthly comparison view
- [ ] Category percentage indicators
- [ ] Drill-down into category transactions

#### US-024 - Timeline of Net Worth

**Frontend Tasks:**

- [ ] Net worth line chart over time
- [ ] Account inclusion/exclusion toggles
- [ ] Zoom controls (1M, 3M, 6M, 1Y, ALL)
- [ ] Milestone markers

#### US-025 - Loan Repayment Schedules

**Frontend Tasks:**

- [ ] Repayment schedule timeline
- [ ] Overdue payment highlights
- [ ] Payment velocity chart
- [ ] Projections de payoff date

**Prioridad:** 🟢 Post-MVP (pero alto valor)

---

## 📋 Technical Considerations

### State Management
- [ ] Setup global state (Context API / Zustand / Redux)
- [ ] Account state management
- [ ] Transaction state management
- [ ] Auth state management
- [ ] UI state (modals, toasts, loading)

### API Integration
- [ ] API client setup (fetch / axios)
- [ ] Error handling global
- [ ] Loading states consistency
- [ ] Optimistic updates para mejor UX

### Performance
- [ ] Code splitting por rutas
- [ ] Lazy loading de componentes pesados
- [ ] Virtual scrolling para listas largas
- [ ] Memoization de componentes costosos
- [ ] Image optimization (si aplica)

### Accessibility
- [ ] Keyboard navigation en todos los forms
- [ ] ARIA labels apropiados
- [ ] Focus management en modals
- [ ] Color contrast compliance (WCAG AA)
- [ ] Screen reader testing

### Testing
- [ ] Unit tests para componentes críticos
- [ ] Integration tests para flows principales
- [ ] E2E tests para user journeys clave

---

## 🎯 Sprint Planning Suggestion

### Sprint 1 (2 semanas) - Foundation
- Setup proyecto Next.js + TailwindCSS
- Componentes base (Button, Input, Modal, Surface)
- Layout principal + navegación
- Auth UI (login/logout)
- Protected routes

### Sprint 2 (2 semanas) - Accounts & Dashboard
- Account CRUD UI
- Dashboard con métricas
- Account detail page
- Responsive design

### Sprint 3 (2 semanas) - Transactions
- Global transaction feed
- Smart search/filter
- Manual transaction creation
- Internal transfers

### Sprint 4 (2 semanas) - Statement Upload
- File upload UI
- Extraction review screen
- Bulk transaction acceptance

### Sprint 5 (2 semanas) - Credit Cards & Loans
- Credit card management UI
- Loan creation and tracking
- Payment forms

### Sprint 6+ - Polish & Post-MVP
- Reporting & charts
- Advanced features
- Performance optimization
- Testing & bug fixing

---

**Última actualización:** 2025-11-30
