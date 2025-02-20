import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(cors());

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Pergunta não fornecida." });
    }

    try {
        // Criar uma thread para conversar com o Assistente
        const thread = await openai.beta.threads.create();
        const threadId = thread.id;

        // Enviar a pergunta ao Assistente
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: question
        });

        // Chamar o Assistente e aguardar a resposta
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: process.env.ASSISTANT_ID
        });

        // Aguardar a conclusão da resposta
        let runStatus;
        do {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2s entre verificações
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        } while (runStatus.status !== "completed");

        // Obter a mensagem de resposta
        const messages = await openai.beta.threads.messages.list(threadId);
        const assistantResponse = messages.data.find(msg => msg.role === "assistant");

        res.json({ answer: assistantResponse.content });
    } catch (error) {
        console.error("Erro na OpenAI:", error);
        res.status(500).json({ error: "Erro ao processar a pergunta." });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
