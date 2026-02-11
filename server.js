require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const url = `https://${process.env.AZURE_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_AI_KEY
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao falar com a Azure" });
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));