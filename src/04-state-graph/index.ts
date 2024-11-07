import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

interface ConversationState {
  messages: string[];
  current_input: string;
  counter: number;
  response?: string;
}

async function main() {
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
    temperature: 0,
  });

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
        Historial de conversación: {messages}
        Contador actual: {counter}
        Entrada actual: {current_input}
        
        Responde de manera apropiada.
    `);

  // Función para decidir si continuar
  const shouldContinue = (state: ConversationState): "continue" | "end" => {
    return state.counter < 3 ? "continue" : "end";
  };

  const workflow = new StateGraph<ConversationState>({
    channels: {
      messages: { value: (prev, next) => next ?? prev ?? [] },
      counter: { value: (prev, next) => next ?? prev ?? 0 },
      response: { value: (prev, next) => next ?? prev ?? "" },
      current_input: { value: (prev, next) => next ?? prev ?? "" },
    },
  });

  // Primero registramos los nodos
  workflow.addNode(
    "start",
    async ({ state }: { state: ConversationState }) => state
  );
  workflow.addNode("agent", async (state: ConversationState) => {
    const response = await RunnableSequence.from([
      promptTemplate,
      model,
    ]).invoke({
      messages: state.messages.join("\n"),
      counter: state.counter,
      current_input: state.current_input,
    });

    return {
      messages: [...state.messages, response.content],
      counter: state.counter + 1,
      response: response.content,
    };
  });

  // Después configuramos las conexiones
  workflow.setEntryPoint("start" as any);
  workflow.addEdge("__start__", "agent" as any);
  workflow.addConditionalEdges("agent" as any, shouldContinue, {
    continue: "agent" as any,
    end: END,
  });

  const app = workflow.compile();

  try {
    const response = await app.invoke({
      messages: [],
      current_input: "¡Hola! ¿Cómo estás?",
      counter: 0,
    });

    console.log("Conversación completa:", response.messages);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
