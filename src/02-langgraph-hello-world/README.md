# LangGraph Hello World

Este ejemplo demuestra la implementación básica de LangGraph con Ollama en TypeScript, mostrando cómo crear flujos de trabajo basados en grafos.

## Descripción

El ejemplo introduce los conceptos fundamentales de LangGraph, ilustrando cómo crear un grafo simple que procesa información secuencialmente. Se enfoca en la creación de nodos, la definición de estados y el manejo del flujo de información.

## Estructura de Archivos 

```plaintext
src/02-langgraph/
├── index.ts # Punto de entrada y configuración principal
├── graph.ts # Implementación del grafo
├── nodes/ # Directorio de nodos
│ ├── process.ts # Nodo de procesamiento
│ └── output.ts # Nodo de salida
└── types.ts # Definiciones de tipos
```

## Componentes Principales

### Estado del Grafo
El estado del grafo mantiene la siguiente información:
- Mensaje actual
- Historial de mensajes
- Estado de finalización

```typescript
interface GraphState {
message: string;
history: string[];
done: boolean;
}
```

### Nodos del Grafo
1. **Nodo de Procesamiento**
   - Procesa el mensaje de entrada
   - Interactúa con el modelo Ollama
   - Actualiza el estado

2. **Nodo de Salida**
   - Determina si el proceso ha terminado
   - Formatea la respuesta final

## Uso

Para ejecutar este ejemplo:

```bash
# Navegar al directorio
cd src/02-langgraph

# Ejecutar el ejemplo
pnpm start
```

## Ejemplo de Código

```typescript
// Ejemplo básico de uso
const graph = new LangGraph({
  nodes: [
    new ProcessNode(),
    new OutputNode()
  ],
  initialState: {
    message: "",
    history: [],
    done: false
  }
});

const result = await graph.run("¿Cuál es tu color favorito?");
```

## Flujo de Trabajo

1. **Inicialización**
   - Configuración del grafo
   - Definición del estado inicial

2. **Procesamiento**
   - El mensaje entra al nodo de procesamiento
   - El modelo genera una respuesta
   - Se actualiza el estado

3. **Finalización**
   - El nodo de salida evalúa el estado
   - Determina si el proceso está completo
   - Retorna el resultado final

## Personalización

Puedes extender este ejemplo:
- Agregando nuevos nodos
- Modificando la lógica de procesamiento
- Implementando diferentes condiciones de finalización
- Agregando manejo de errores personalizado

## Consideraciones Importantes

- El grafo debe tener un estado inicial bien definido
- Cada nodo debe manejar correctamente el estado
- Es importante mantener la inmutabilidad del estado
- Los nodos deben ser independientes y reutilizables

## Depuración

Para facilitar la depuración:
- Usa el logger incorporado
- Monitorea el estado entre nodos
- Verifica las transiciones del grafo
