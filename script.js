// Configurações da API Azure
const AZURE_CONFIG = {
    endpoint: "process.env.AZURE_ENDPOINT",
    apiKey: "process.env.AZURE_AI_KEY",
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
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Limpa input e exibe mensagem do usuário
    userInput.value = '';
    appendMessage(message, 'user');

    // 2. Adiciona um indicador de "Digitando..." temporário
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing-indicator';
    typingIndicator.innerHTML = `<div class="bubble">...</div>`;
    chatBox.appendChild(typingIndicator);

    // 3. Montagem da Requisição
    const url = `https://${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentId}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`;
    
    const requestData = {
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
        temperature: 0.7
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "api-key": AZURE_CONFIG.apiKey
            },
            body: JSON.stringify(requestData)
        });

        typingIndicator.remove();

        if (response.ok) {
            const result = await response.json();
            const botResponse = result.choices?.[0]?.message?.content || "Sem resposta do servidor.";
            appendMessage(botResponse, 'bot');
        } else {
            console.error('Erro Azure:', response.status);
            appendMessage("Desculpe, houve um erro na comunicação com a Azure.", 'bot');
        }

    } catch (error) {
        typingIndicator.remove();
        console.error('Erro de Rede:', error);
        appendMessage("Erro de conexão. Verifique sua internet.", 'bot');
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