import WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  const newPost = {
    id: Date.now(),
    name: 'New Post Title',
    image: 'Sample Image',
    instructions: ['Step 1', 'Step 2', 'Step 3']
  };

  ws.send(JSON.stringify(newPost));
  ws.close();
});
