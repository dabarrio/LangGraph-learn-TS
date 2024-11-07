import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { Calculator } from "@langchain/community/tools/calculator";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

async function main() {
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b-instruct-q8_0",
    temperature: 0,
  });
  const embeddings = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
    requestOptions: {
      temperature: 0,
    },
  });

  // Definimos múltiples herramientas
  const tools = [
    new Calculator(),
    new WebBrowser({
      model,
      embeddings,
    }),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Eres un asistente que puede elegir entre diferentes herramientas:
            - Calculadora para operaciones matemáticas
            - Navegador web para búsquedas
            Elige la herramienta más apropiada para cada tarea.`,
    ],
    ["human", "{input}"],
    ["assistant", "Analizaré la pregunta y elegiré la mejor herramienta."],
    ["human", "{agent_scratchpad}"],
  ],
);

  const agent = await createOpenAIToolsAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  try {
    const result = await agentExecutor.invoke({
      input:
        "¿Cuál es la raíz cuadrada de 144 y por qué es importante este número?",
    });
    console.log("Resultado:", result.output);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
