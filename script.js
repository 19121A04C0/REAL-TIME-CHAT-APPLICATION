const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:3000');

// Handle incoming messages
socket.onmessage = async (event) => {
  const message = document.createElement('div');

  // Check if the received data is a Blob
  if (event.data instanceof Blob) {
    const text = await event.data.text(); // Convert Blob to text
    message.textContent = text;
  } else {
    // If it's plain text or JSON, use it directly
    try {
      const data = JSON.parse(event.data); // Parse JSON
      message.textContent = data.text || data; // Use `data.text` if it's structured, otherwise use raw data
    } catch (error) {
      message.textContent = event.data; // Fallback to plain text
    }
  }

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
};

// Send message on button click
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    // Wrap the message in JSON for consistency
    socket.send(JSON.stringify({ text: message }));
    messageInput.value = '';
  }
});

// Send message on "Enter" key press
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});
