# Ollama RAG (Retrieval-Augmented Generation)

Este ejemplo implementa un sistema RAG utilizando Ollama, permitiendo generar respuestas basadas en documentos y conocimiento contextual.

## Descripción

El sistema RAG combina la recuperación de información relevante de una base de documentos con la generación de respuestas utilizando Ollama. Este enfoque permite respuestas más precisas y contextualizadas basadas en fuentes específicas.

## Estructura de Archivos 

```plaintext
src/07-ollama-rag/
├── index.ts # Punto de entrada principal
├── rag/
│ ├── retriever.ts # Sistema de recuperación
│ ├── embeddings.ts # Manejo de embeddings
│ └── generator.ts # Generación de respuestas
├── vectorstore/
│ ├── store.ts # Almacenamiento de vectores
│ └── index.ts # Indexación de documentos
├── documents/
│ ├── processor.ts # Procesamiento de documentos
│ └── loader.ts # Carga de documentos
└── types/
├── document.ts # Tipos de documentos
├── embedding.ts # Tipos de embeddings
└── response.ts # Tipos de respuestas
```

## Componentes del Sistema

### 1. Procesamiento de Documentos
```

interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    timestamp: Date;
    type: DocumentType;
  };
  chunks: DocumentChunk[];
}

interface DocumentChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: ChunkMetadata;
}
```

### 2. Sistema de Embeddings
```

interface EmbeddingConfig {
  model: string;
  dimensions: number;
  batchSize: number;
  options: {
    normalize: boolean;
    cache: boolean;
  };
}
```

## Flujo del Sistema RAG

```

graph TD
    A[Entrada Query] --> B[Generar Embedding]
    B --> C[Búsqueda Vectorial]
    C --> D[Recuperar Documentos]
    D --> E[Generar Contexto]
    E --> F[Generar Respuesta]
    F --> G[Salida]
```

## Uso

Para ejecutar este ejemplo:

```

# Navegar al directorio
cd src/07-ollama-rag

# Ejecutar el ejemplo
pnpm start
```

## Ejemplo de Código

```

// Ejemplo de uso del sistema RAG
const ragSystem = new OllamaRAG({
  embeddingConfig: {
    model: "llama2",
    dimensions: 384,
    batchSize: 32
  },
  retrieverConfig: {
    topK: 3,
    minScore: 0.7
  },
  generatorConfig: {
    maxTokens: 512,
    temperature: 0.7
  }
});

// Indexar documentos
await ragSystem.indexDocuments(documents);

// Realizar consulta
const response = await ragSystem.query("¿Cuál es la política de devoluciones?");
```

## Características Principales

1. **Procesamiento de Documentos**
   - Chunking inteligente
   - Extracción de metadata
   - Normalización de contenido

2. **Sistema de Embeddings**
   - Generación eficiente
   - Caché de embeddings
   - Batch processing

3. **Recuperación**
   - Búsqueda semántica
   - Ranking por relevancia
   - Filtrado contextual

4. **Generación**
   - Respuestas contextualizadas
   - Control de longitud
   - Manejo de referencias

## Configuración del Sistema

### Vector Store
```

interface VectorStoreConfig {
  dimensions: number;
  metric: "cosine" | "euclidean" | "dot";
  indexType: "flat" | "hnsw";
  cache: {
    enabled: boolean;
    maxSize: number;
  };
}
```

### Retriever
```

interface RetrieverConfig {
  topK: number;
  minScore: number;
  filters?: {
    dateRange?: DateRange;
    documentTypes?: DocumentType[];
    sources?: string[];
  };
}
```

## Optimización

1. **Indexación**
   - Batch processing
   - Indexación incremental
   - Compresión de vectores

2. **Búsqueda**
   - Caché de resultados
   - Búsqueda aproximada
   - Paralelización

3. **Generación**
   - Prompt engineering
   - Control de contexto
   - Manejo de tokens

## Mejores Prácticas

1. **Preparación de Documentos**
   - Limpieza de texto
   - Chunking apropiado
   - Metadata consistente

2. **Configuración del Sistema**
   - Ajuste de parámetros
   - Monitoreo de rendimiento
   - Gestión de recursos

3. **Mantenimiento**
   - Actualización de índices
   - Limpieza de caché
   - Monitoreo de calidad

## Depuración y Monitoreo

- Logs detallados
- Métricas de rendimiento
- Trazabilidad de respuestas
- Análisis de calidad

## Extensiones Posibles

- Soporte multilingüe
- Indexación en tiempo real
- Filtros personalizados
- Integración con bases de datos externas

## Limitaciones

- Consumo de memoria en grandes colecciones
- Latencia en generación de embeddings
- Límites de contexto en generación
```
