// Configurações da API Azure
const AZURE_CONFIG = {
    endpoint: process.env.AZURE_ENDPOINT, 
    apiKey: process.env.AZURE_AI_KEY,
    deploymentId: "gpt-4o",
    apiVersion: "2024-05-01-preview"
};

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const chatForm = document.getElementById('chatForm');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const content = sender === 'bot' 
        ? `<div class="avatar"><i class="fa-solid fa-robot"></i></div><div class="bubble">${text.replace(/\n/g, '<br>')}</div>`
        : `<div class="bubble">${text}</div>`;

    messageDiv.innerHTML = content;
    chatBox.appendChild(messageDiv);

    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });
}
async function sendMessage() {
    try {
        const response = await fetch('/api/chat', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", content: message }],
                max_tokens: 500
            })
        });
    } catch (error) {
        appendMessage("Erro de conexão com o servidor local.", 'bot');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    userInput.focus();
});