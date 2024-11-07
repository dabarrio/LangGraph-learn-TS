import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

async function main() {
  // Configuración del modelo y embeddings
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
    temperature: 0,
  });

  const embeddings = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
  });

  // Crear documentos de ejemplo
  const docs = [
    new Document({
      pageContent: "TypeScript es un superconjunto tipado de JavaScript",
      metadata: { source: "typescript-docs" },
    }),
    new Document({
      pageContent: "JavaScript es un lenguaje de programación interpretado",
      metadata: { source: "javascript-docs" },
    }),
  ];

  // Crear vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  // Crear prompt para RAG
  const prompt = ChatPromptTemplate.fromTemplate(`
        Contexto: {context}
        
        Pregunta: {input}
        
        Responde usando solo la información del contexto proporcionado.
    `);

  // Crear cadena de documentos
  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
    //documentPrompt: ChatPromptTemplate.fromTemplate(`{pageContent}`),
  });

  // Crear cadena de recuperación
  const retrievalChain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain: documentChain,
  });

  try {
    const response = await retrievalChain.invoke({
      input: "¿Qué es TypeScript?",
    });
    console.log("Respuesta:", response.answer);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
