import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Calculator } from "@langchain/community/tools/calculator";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

async function main() {
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "llama3.2",
        temperature: 0
    });

    // Definimos las herramientas
    const tools = [new Calculator()];

    // Creamos el prompt del agente
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Eres un asistente útil que puede usar herramientas para resolver problemas matemáticos."],
        ["human", "{input}"],
        ["assistant", "Voy a ayudarte a resolver ese problema paso a paso."],
        ["human", "{agent_scratchpad}"]
    ]);

    // Creamos el agente
    const agent = await createOpenAIToolsAgent({
        llm: model,
        tools,
        prompt
    });

    // Creamos el ejecutor
    const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true
    });

    try {
        const result = await agentExecutor.invoke({
            input: "¿Cuánto es 123 * 456?"
        });
        console.log("Resultado:", result.output);
    } catch (error) {
        console.error("Error:", error);
    }
}

main(); 