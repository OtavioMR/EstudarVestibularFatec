const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. USE A CHAVE NOVA QUE VOCÊ VAI GERAR AQUI!
const API_KEY = "chave da api vai aqui"; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/generate-quiz', async (req, res) => {
    try {
        const { materias } = req.body;
        
        // MUDANÇA AQUI: Usando o nome exato que funcionou no seu CURL
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Gere 3 questões de múltipla escolha para o vestibular da FATEC sobre: ${materias.join(', ')}. 
        Retorne APENAS o JSON puro, sem markdown:
        [{"materia": "...", "enunciado": "...", "opcoes": ["", "", "", ""], "correta": 0, "explicacao": "..."}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().replace(/```json|```/g, "").trim();

        console.log("IA respondeu com sucesso!");
        res.json(JSON.parse(text));

    } catch (error) {
        console.error("ERRO NO SERVIDOR:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Servidor ON na porta 3000"));