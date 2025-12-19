const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS : Autorise votre site à parler au backend
// En production, remplacez '*' par 'https://www.hydroneal.ca' pour plus de sécurité
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialisation de l'API Google avec la clé secrète (stockée sur Render)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route de test (pour vérifier que le serveur tourne)
app.get('/', (req, res) => {
    res.send('Backend HydroNeal en ligne. Utilisez POST /generate pour l\'IA.');
});

// Route principale pour générer du texte
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Le prompt est vide." });
        }

        console.log("Reçu prompt :", prompt.substring(0, 50) + "...");

        // Choix du modèle : gemini-1.5-flash est rapide et stable
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Réponse générée.");
        res.json({ text: text });

    } catch (error) {
        console.error("ERREUR BACKEND :", error);
        
        // Renvoie une erreur explicite au frontend
        res.status(500).json({ 
            error: "Erreur lors de la génération IA.", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
