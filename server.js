const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour autoriser ton frontend GitHub Pages
// Tu peux remplacer '*' par ton URL GitHub précise pour plus de sécurité
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        // 1. Vérification de la clé API
        // Assure-toi d'avoir ajouté GEMINI_API_KEY dans les variables d'environnement sur Render
        if (!process.env.GEMINI_API_KEY) {
            console.error("ERREUR : Clé API manquante dans les variables d'environnement.");
            return res.status(500).json({ error: "Configuration serveur incorrecte (Clé API)" });
        }

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Le prompt est vide" });

        // 2. Initialisation de Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 3. Configuration du modèle avec tes paramètres spécifiques
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // Assure-toi que ce nom de modèle est bien actif sur ton compte
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 65536,
                // Note: "thinking: true" est souvent une capacité du modèle plutôt qu'un paramètre de config.
                // Si le modèle supporte le mode pensée explicitement via l'API, c'est ici qu'on l'ajoute,
                // mais pour l'instant les paramètres standards sont ceux ci-dessus.
            }
        });

        // 4. Génération
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (error) {
        console.error("Erreur serveur lors de la génération :", error);
        // On renvoie l'erreur au front pour mieux comprendre ce qui se passe (ex: modèle introuvable)
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
});

app.listen(PORT, () => console.log(`Serveur grimoire prêt sur le port ${PORT}`));
