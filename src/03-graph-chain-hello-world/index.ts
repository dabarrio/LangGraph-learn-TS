import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";

interface GraphState {
  input: string;
  intermediate?: string;
  final_answer?: string;
}

async function main() {
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
    temperature: 0,
  });

  // Primer nodo: Análisis inicial
  const analyzePrompt = ChatPromptTemplate.fromTemplate(`
        Analiza la siguiente pregunta y proporciona un contexto inicial:
        Pregunta: {input}
    `);

  const answerPrompt = ChatPromptTemplate.fromTemplate(`
        Basado en este análisis: {intermediate}
        Proporciona una respuesta final a la pregunta original: {input}
    `);

  // Creamos el grafo con los reductores apropiados
  const workflow = new StateGraph<GraphState>({
    channels: {
      input: { value: () => "input" },
      intermediate: { value: () => "intermediate" },
      final_answer: { value: () => "final_answer" },
    },
  }) as any;

  // Agregamos los nodos con nombres diferentes a los reservados
  workflow.addNode("analyze_step", async (options: any) => {
    const response = await analyzePrompt.pipe(model).invoke({
      input: options.input
    });
    return { intermediate: response.content };
  });

  workflow.addNode("answer_step", async (options: any) => {
    const response = await answerPrompt.pipe(model).invoke({
      input: options.input,
      intermediate: options.intermediate
    });
    return { final_answer: response.content };
  });

  // Definimos el flujo
  workflow.setEntryPoint("analyze_step");
  workflow.addEdge("analyze_step", "answer_step");
  workflow.addEdge("answer_step", END);

  // Compilamos y ejecutamos
  const app = workflow.compile();

  try {
    const response = await app.invoke({
      input: "¿Cuáles son los beneficios de usar TypeScript sobre JavaScript?"
    });
    console.log("Análisis:", response.intermediate);
    console.log("Respuesta Final:", response.final_answer);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
