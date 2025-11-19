# TODO - FinModel Pro SaaS

## Módulo 1: Gestión de Proyectos
- [x] Crear, editar y eliminar proyectos financieros
- [x] Clonar proyectos existentes
- [x] Guardar versiones de proyectos
- [x] Seleccionar plantilla por industria (refinería, planta química, energía renovable)

## Módulo 2: Gestión de Ingresos
- [x] Configurar tipos de productos/servicios
- [x] Definir precios medios de venta por producto
- [x] Establecer volúmenes de venta proyectados
- [x] Aplicar estacionalidad a productos
- [x] Calcular proyecciones de ingresos automáticamente

## Módulo 3: Costos Directos (COGS)
- [x] Introducir costo de materia prima
- [x] Agregar otros componentes de COGS
- [x] Definir crecimiento anual por rubro
- [x] Expresar costos como porcentaje del precio de venta
- [x] Calcular COGS total automáticamente

## Módulo 4: Salarios y Personal
- [ ] Crear catálogo de posiciones laborales
- [ ] Definir fecha de inicio/fin para cada posición
- [ ] Establecer costo mensual por posición
- [ ] Calcular salarios totales automáticamente
- [ ] Integrar salarios en flujo de caja

## Módulo 5: Gastos Operativos (OPEX)
- [ ] Definir gastos variables como % de ingresos
- [ ] Categorizar diferentes tipos de gastos operativos
- [ ] Calcular OPEX total automáticamente

## Módulo 6: Gastos Fijos y Mantenimiento
- [ ] Introducir gastos fijos periódicos
- [ ] Programar turnarounds y mantenimientos mayores
- [ ] Definir fechas y montos para cada gasto fijo

## Módulo 7: CAPEX / Desarrollo
- [ ] Planificar gastos de desarrollo o adquisición
- [ ] Definir fechas de compra
- [ ] Establecer retraso de pago
- [ ] Asignar montos a cada inversión

## Módulo 8: Estados Financieros Automatizados
- [x] Generar Income Statement automáticamente
- [x] Desglosar ingresos por producto en Income Statement
- [x] Mostrar costos de materia prima en Income Statement
- [x] Generar Cash Flow Statement automáticamente
- [x] Mostrar actividades operativas en Cash Flow
- [x] Mostrar actividades de inversión en Cash Flow
- [x] Mostrar actividades de financiación en Cash Flow
- [x] Calcular EBITDA automáticamente

## Módulo 9: Fuentes y Usos de Fondos
- [ ] Modelar aportaciones de capital
- [ ] Modelar deudas y estructura de financiamiento
- [ ] Definir usos previstos de fondos
- [ ] Generar gráficos comparativos de fuentes y usos
- [ ] Mostrar drawdowns de deuda
- [ ] Mostrar levantamientos de capital

## Módulo 10: Dashboards y KPIs
- [x] Crear dashboard principal con métricas clave
- [x] Mostrar revenues en dashboard
- [x] Mostrar COGS en dashboard
- [x] Mostrar EBITDA en dashboard
- [x] Calcular y mostrar punto de equilibrio (break-even)
- [x] Calcular y mostrar retorno de inversión (ROI)
- [x] Crear gráficos comparativos de ingresos vs gastos
- [x] Crear gráficos de evolución temporal de KPIs

## Módulo 11: Exportación de Reportes
- [ ] Exportar reportes a PDF
- [ ] Exportar reportes a Excel
- [ ] Incluir todos los estados financieros en exportación
- [ ] Incluir gráficos y visualizaciones en exportación

## Módulo 12: Sistema de Suscripciones
- [ ] Implementar planes de suscripción (Free, Professional, Enterprise)
- [ ] Diferenciar por número de proyectos permitidos
- [ ] Diferenciar por nivel de soporte
- [ ] Implementar período de prueba gratuito
- [ ] Integrar pasarela de pagos con Stripe

## Módulo 13: Experiencia de Usuario
- [x] Diseñar interfaz con formularios guiados
- [x] Crear plantillas preconfiguradas por industria
- [x] Implementar validaciones básicas en formularios
- [x] Permitir navegación intuitiva entre módulos
- [x] Implementar sistema de ayuda contextual

## Módulo 14: Infraestructura y Seguridad
- [x] Implementar autenticación de usuarios
- [x] Implementar autorización basada en roles
- [ ] Proteger datos sensibles de proyectos
- [ ] Implementar backup automático de datos
- [ ] Optimizar rendimiento de cálculos financieros

## Base de Datos
- [x] Crear tabla de proyectos (projects)
- [x] Crear tabla de productos de ingresos (revenue_products)
- [x] Crear tabla de costos directos (cogs_items)
- [x] Crear tabla de salarios (salaries)
- [x] Crear tabla de gastos operativos (opex_items)
- [x] Crear tabla de gastos fijos (fixed_expenses)
- [x] Crear tabla de CAPEX (capex_items)
- [x] Crear tabla de fuentes de financiamiento (funding_sources)
- [x] Crear tabla de suscripciones (subscriptions)
- [x] Crear tabla de plantillas de proyectos (project_templates)
- [x] Aplicar migraciones de base de datos

## Backend API
- [x] Implementar funciones de consulta para proyectos
- [x] Implementar funciones de consulta para productos de ingresos
- [x] Implementar funciones de consulta para COGS
- [x] Implementar funciones de consulta para salarios
- [x] Implementar funciones de consulta para OPEX
- [x] Implementar funciones de consulta para gastos fijos
- [x] Implementar funciones de consulta para CAPEX
- [x] Implementar funciones de consulta para fuentes de financiamiento
- [x] Implementar routers tRPC para todos los módulos
- [x] Crear módulo de cálculos financieros
- [x] Implementar cálculo de ingresos mensuales
- [x] Implementar cálculo de COGS mensuales
- [x] Implementar cálculo de salarios mensuales
- [x] Implementar cálculo de OPEX mensuales
- [x] Implementar cálculo de gastos fijos mensuales
- [x] Implementar cálculo de CAPEX mensuales
- [x] Implementar generación de Income Statement
- [x] Implementar generación de Cash Flow Statement
- [x] Implementar cálculo de KPIs (ROI, EBITDA, break-even)

## Nuevas Mejoras - Fase 2

### Exportación de Reportes
- [x] Instalar bibliotecas de exportación (jsPDF, xlsx)
- [x] Implementar exportación de Income Statement a PDF
- [x] Implementar exportación de Cash Flow a PDF
- [x] Implementar exportación de Dashboard a PDF
- [x] Implementar exportación de estados financieros a Excel
- [x] Agregar botones de exportación en la interfaz

### Sistema de Suscripciones con Stripe
- [x] Integrar Stripe en el proyecto
- [x] Configurar planes de suscripción (Free, Professional, Enterprise)
- [x] Crear página de planes y precios
- [x] Implementar checkout de Stripe
- [x] Implementar webhooks de Stripe
- [x] Restringir funcionalidades según plan
- [x] Crear página de gestión de suscripción

### Gráficos Interactivos
- [x] Instalar biblioteca de gráficos (Recharts)
- [x] Crear gráfico de evolución de ingresos
- [x] Crear gráfico de evolución de costos
- [x] Crear gráfico de flujo de efectivo acumulado
- [x] Crear gráfico comparativo de ingresos vs gastos
- [x] Integrar gráficos en el dashboard
- [x] Agregar interactividad y tooltips a los gráficos

## Rediseño UI/UX - Fase 3 (Inspirado en Notion, Linear, Tendencias 2025)

### Estética Minimalista y Modular
- [x] Actualizar paleta de colores a neutros (grises, blancos) con acentos
- [x] Rediseñar sistema de diseño con componentes modulares
- [x] Implementar tarjetas/widgets independientes para cada módulo
- [x] Agregar funcionalidad drag-and-drop para reorganizar dashboard
- [x] Crear sistema de grid flexible para layout personalizable

### Estados Vacíos y Plantillas
- [x] Diseñar estados vacíos atractivos con CTAs claros
- [x] Agregar mensajes contextuales para módulos sin datos
- [x] Crear plantillas predefinidas (refinería, planta química, solar)
- [x] Implementar selector de plantillas en creación de proyecto
- [x] Agregar datos de ejemplo para exploración

### Onboarding Integrado
- [x] Implementar tooltips contextuales para campos complejos
- [x] Crear guías integradas en el dashboard
- [x] Agregar tour interactivo para nuevos usuarios
- [x] Implementar hints progresivos (progressive disclosure)
- [x] Crear proyecto demo con datos precargados

### Visualización de Datos
- [x] Implementar micro-visualizaciones (sparklines, progress rings)
- [x] Rediseñar gráficos con estética minimalista
- [x] Optimizar diseño responsive para móviles
- [x] Agregar vistas plegables para secciones
- [x] Implementar animaciones sutiles para transiciones

### Personalización
- [x] Agregar selector de tema (claro/oscuro)
- [x] Implementar selector de color de acento
- [ ] Crear panel de preferencias de usuario
- [ ] Agregar configuración de módulos visibles
- [ ] Implementar vistas por rol (CFO, gerente, analista)
- [x] Agregar atajos de teclado
- [x] Implementar buscador global (Command K)

### Colaboración
- [ ] Agregar sistema de comentarios en widgets
- [ ] Implementar menciones a usuarios (@usuario)
- [ ] Crear registro de actividad reciente
- [ ] Agregar indicadores de presencia en tiempo real
- [ ] Implementar compartir proyectos con permisos

### Accesibilidad
- [x] Asegurar contraste WCAG AA
- [x] Implementar navegación por teclado completa
- [x] Agregar soporte para lectores de pantalla
- [x] Optimizar tamaños de fuente y espaciado
- [x] Agregar indicadores de foco visibles

### Componentes Creados
- [x] CommandPalette - Buscador global con Cmd+K
- [x] EmptyState - Estados vacíos reutilizables
- [x] HelpTooltip - Tooltips contextuales
- [x] OnboardingTour - Tour interactivo de 6 pasos
- [x] TemplateSelector - Selector de plantillas de industria
- [x] DashboardWidget - Widgets modulares con drag-and-drop
