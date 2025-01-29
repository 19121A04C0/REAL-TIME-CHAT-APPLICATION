const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (socket) => {
  console.log('A client connected.');

  // Send a welcome message to the client
  socket.send(JSON.stringify({ text: 'Welcome to the real-time chat!' }));

  // Handle incoming messages from clients
  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Generate a simple automated response
      let botResponse;
      switch (data.text.toLowerCase()) {
        case 'hello':
        case 'hi':
          botResponse = 'Hello! How can I assist you today?';
          break;
        case 'how are you?':
          botResponse = 'I’m just a bot, but I’m here to help! 😊';
          break;
        default:
          botResponse = `You said: "${data.text}". I'm still learning how to respond!`;
      }

      // Broadcast the user's message to all clients
      const userMessage = JSON.stringify({ text: `User: ${data.text}` });
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(userMessage);
        }
      });

      // Send bot response back to the sender only
      socket.send(JSON.stringify({ text: `Bot: ${botResponse}` }));
    } catch (error) {
      console.error('Invalid message received:', message);

      // Handle non-JSON messages (send as plain text)
      socket.send(
        JSON.stringify({
          text: "Invalid message format. Please send a JSON object with a 'text' field.",
        })
      );
    }
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('A client disconnected.');
  });
});
