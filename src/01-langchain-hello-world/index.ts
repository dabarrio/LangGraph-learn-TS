import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

async function main() {
    // Configuración del modelo Ollama
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "llama3.2",
        temperature: 0
    });

    // Definimos el prompt
    const prompt = ChatPromptTemplate.fromTemplate(`
        Eres un asistente muy útil y amigable.
        Instrucciones: Responde de manera concisa y clara.
        Pregunta del usuario: {input}
    `);

    // Creamos la secuencia de ejecución
    const chain = RunnableSequence.from([
        prompt,
        model,
        new StringOutputParser()
    ]);

    // Ejecutamos y obtenemos la respuesta
    try {
        const response = await chain.invoke({
            input: "¿Cuáles son los principios básicos de la programación?"
        });
        console.log("Respuesta:", response);
    } catch (error) {
        console.error("Error:", error);
    }
}

main(); 