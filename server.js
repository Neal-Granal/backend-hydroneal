const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialisation Gemini
// Vérification de la clé au démarrage
if (!process.env.GEMINI_API_KEY) {
    console.error("ERREUR FATALE : La clé GEMINI_API_KEY est manquante dans les variables d'environnement !");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Le prompt est vide." });
        }

        console.log("Reçu prompt :", prompt);

        // On utilise le modèle standard
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Réponse générée avec succès.");
        res.json({ text: text });

    } catch (error) {
        console.error("ERREUR GENERATION :", error);
        // On renvoie l'erreur détaillée au frontend pour comprendre (à retirer en prod si sensible)
        res.status(500).json({ 
            error: "Erreur interne du serveur IA.", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur Backend HydroNeal en ligne sur le port ${PORT}`);
});
