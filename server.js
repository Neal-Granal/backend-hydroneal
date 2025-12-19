const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Autorise tout le monde (pour test) ou restreignez à votre site
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        // 1. Vérif Clé
        if (!process.env.GEMINI_API_KEY) {
            console.error("Clé API manquante");
            return res.status(500).json({ error: "Config serveur incorrecte" });
        }

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vide" });

        // 2. Appel Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Modèle standard stable
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
