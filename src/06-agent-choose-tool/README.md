# Agent Choose Tool

Este ejemplo demuestra un agente avanzado capaz de seleccionar dinámicamente entre múltiples herramientas basándose en el contexto y los requisitos de la tarea.

## Descripción

El sistema implementa un agente inteligente que puede evaluar el contexto de una tarea y seleccionar la herramienta más apropiada de un conjunto disponible. El agente utiliza un proceso de decisión para determinar qué herramienta usar y cuándo cambiar entre herramientas.

## Estructura de Archivos 

```plaintext
src/06-agent-choose-tool/
├── index.ts # Punto de entrada principal
├── agent/
│ ├── chooser.ts # Lógica de selección de herramientas
│ ├── executor.ts # Ejecutor de herramientas
│ └── validator.ts # Validación de selección
├── tools/
│ ├── calculator.ts # Herramienta de cálculo
│ ├── search.ts # Herramienta de búsqueda
│ ├── translator.ts # Herramienta de traducción
│ └── base.ts # Clase base de herramientas
├── nodes/
│ ├── evaluate.ts # Evaluación de necesidades
│ ├── select.ts # Selección de herramienta
│ ├── execute.ts # Ejecución de herramienta
│ └── review.ts # Revisión de resultados
└── types/
├── agent.ts # Tipos del agente
├── decision.ts # Tipos de decisiones
└── tools.ts # Tipos de herramientas
```

## Sistema de Decisión

```

interface DecisionCriteria {
  confidence: number;
  relevance: number;
  cost: number;
  complexity: number;
  previousSuccess: number;
}

interface ToolSelection {
  tool: Tool;
  criteria: DecisionCriteria;
  context: Context;
}
```

## Estado del Agente

```typescript
interface AgentState {
  available_tools: Tool[];
  tool_history: ToolUse[];
  current_selection: ToolSelection | null;
  context: {
    task: string;
    constraints: string[];
    preferences: Map<string, any>;
  };
  metrics: {
    success_rate: Map<string, number>;
    usage_count: Map<string, number>;
    average_time: Map<string, number>;
  };
}
```

## Proceso de Selección

```graph 
    TD
    A[Analizar Tarea] --> B[Evaluar Herramientas]
    B --> C[Calcular Puntuaciones]
    C --> D[Seleccionar Mejor Opción]
    D --> E{¿Selección Válida?}
    E -->|Sí| F[Ejecutar Herramienta]
    E -->|No| G[Reevaluar Opciones]
    G --> B
```

## Uso

Para ejecutar este ejemplo:

```

# Navegar al directorio
cd src/06-agent-choose-tool

# Ejecutar el ejemplo
pnpm start
```

## Ejemplo de Código

```

// Ejemplo de uso del agente con selección de herramientas
const agent = new ToolChooserAgent({
  tools: [
    new CalculatorTool(),
    new SearchTool(),
    new TranslatorTool()
  ],
  selectionConfig: {
    minConfidence: 0.7,
    maxAttempts: 3,
    timeoutMs: 5000
  }
});

const result = await agent.run({
  task: "Traduce y calcula el resultado de 'twenty-five times forty-eight'",
  preferences: {
    language: "es",
    precision: "high"
  }
});
```

## Características Principales

1. **Evaluación Contextual**
   - Análisis de requisitos
   - Comprensión de contexto
   - Identificación de restricciones

2. **Sistema de Puntuación**
   - Relevancia de herramienta
   - Historial de éxito
   - Costo computacional
   - Complejidad de la tarea

3. **Aprendizaje Adaptativo**
   - Mejora de selección basada en resultados
   - Ajuste dinámico de criterios
   - Memoria de éxitos/fracasos

## Criterios de Selección

1. **Relevancia**
   - Coincidencia con la tarea
   - Capacidades requeridas
   - Restricciones técnicas

2. **Rendimiento**
   - Tiempo de ejecución
   - Uso de recursos
   - Tasa de éxito

3. **Contexto**
   - Preferencias del usuario
   - Requisitos específicos
   - Restricciones temporales

## Mejores Prácticas

1. **Configuración de Herramientas**
   - Definir claramente capacidades
   - Establecer límites de uso
   - Documentar requisitos

2. **Gestión de Selección**
   - Implementar fallbacks
   - Manejar timeouts
   - Validar selecciones

3. **Monitoreo y Mejora**
   - Registrar decisiones
   - Analizar patrones
   - Optimizar criterios

## Depuración

Herramientas de depuración incluidas:
- Registro de decisiones
- Métricas de rendimiento
- Trazabilidad de selección
- Análisis de fallos

## Extensibilidad

Para agregar una nueva herramienta con criterios de selección:

```

class NewTool extends BaseTool {
  getSelectionCriteria(context: Context): DecisionCriteria {
    return {
      confidence: this.calculateConfidence(context),
      relevance: this.evaluateRelevance(context),
      cost: this.estimateCost(context),
      complexity: this.assessComplexity(context),
      previousSuccess: this.getSuccessRate()
    };
  }
}
```

## Limitaciones Conocidas

- Overhead en selección inicial
- Dependencia del historial
- Limitaciones de memoria
```