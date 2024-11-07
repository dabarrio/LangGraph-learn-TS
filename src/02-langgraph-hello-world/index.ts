import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

interface GraphState {
    input: string;
    response?: string;
}

async function main() {
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "llama3.2",
        temperature: 0
    });

    const promptTemplate = ChatPromptTemplate.fromTemplate(`
        Eres un asistente útil y conciso.
        Pregunta: {input}
        Responde de manera breve y clara.
    `);

    const chain = RunnableSequence.from([
        promptTemplate,
        model
    ]);

    // Corregimos la definición del StateGraph
    const workflow = new StateGraph<GraphState>({
        channels: {
            input: { 
                value: (x: string) => x
            },
            response: { 
                value: (x: string | undefined) => x ?? ""
            }
        }
    }) as any;

    workflow.addNode("responder", async (state: GraphState) => {
        const response = await chain.invoke({
            input: state.input
        });
        return { response: response.content };
    });

    workflow.addEdge("__start__", "responder");
    workflow.addEdge("responder", END);

    const app = workflow.compile();

    try {
        const response = await app.invoke({
            input: "¿Qué es TypeScript?"
        });
        console.log("Respuesta:", response.response);
    } catch (error) {
        console.error("Error:", error);
    }
}

main(); 