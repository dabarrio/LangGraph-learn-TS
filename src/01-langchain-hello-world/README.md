# LangChain Hello World

Este ejemplo demuestra la implementación básica de LangChain con Ollama en TypeScript.

## Descripción

El ejemplo "Hello World" muestra cómo configurar y utilizar LangChain con Ollama para realizar operaciones básicas de procesamiento de lenguaje natural. Se enfoca en la creación de una cadena simple y la interacción con el modelo de lenguaje.

## Estructura de Archivos

```plaintext
src/01/
├── index.ts        # Punto de entrada principal
├── chain.ts        # Implementación de la cadena básica
└── types.ts        # Definiciones de tipos
```

## Componentes Principales

### Chain Básica

La cadena implementada en este ejemplo demuestra:
- Configuración básica de Ollama
- Creación de una cadena simple
- Manejo de prompts y respuestas

## Uso

Para ejecutar este ejemplo:

```bash
# Navegar al directorio
cd src/01

# Ejecutar el ejemplo
pnpm start
```

## Ejemplo de Código

```typescript
// Ejemplo básico de uso
const chain = new Chain({
    llm: new Ollama({
        model: "llama2"
    })
});

const response = await chain.run("¿Cuál es la capital de Francia?");
console.log(response);
```

## Conceptos Clave

1. **Configuración del Modelo**
   - Inicialización de Ollama
   - Selección del modelo base

2. **Manejo de Cadenas**
   - Creación de cadenas simples
   - Procesamiento de entrada/salida

3. **Gestión de Prompts**
   - Estructuración de prompts
   - Formateo de respuestas

## Personalización

Puedes modificar este ejemplo:
- Cambiando el modelo de Ollama
- Ajustando los parámetros del modelo
- Modificando los prompts
- Agregando procesamiento adicional

## Notas Adicionales

- Asegúrate de tener Ollama ejecutándose localmente
- El modelo debe estar descargado en tu sistema
- Revisa la documentación de Ollama para más opciones de configuración
```