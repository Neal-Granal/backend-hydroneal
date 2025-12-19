const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Sécurité : Autoriser seulement ton site
app.use(cors({
    origin: '*', // CHANGE CECI par 'https://www.hydroneal.ca' une fois que ça marche !
    methods: ['POST']
}));

app.use(express.json());

// Initialisation de Gemini avec la clé secrète du serveur
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Prompt manquant" });
        }

        // Configuration du modèle
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ error: "Erreur interne lors de la génération." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});