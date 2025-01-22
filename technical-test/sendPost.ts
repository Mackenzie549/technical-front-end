// Due to the fact I'm dummying the api, I thought this would be a simple option to allow users to fake a post creation
import WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

// Open the WebSocket connection
ws.on('open', () => {
  const newPost = {
    id: Date.now(),
    name: 'New Post Title',
    image: 'Sample Image',
    instructions: ['Step 1', 'Step 2', 'Step 3']
  };

  // Send the new post to the WebSocket server
  ws.send(JSON.stringify(newPost));
  ws.close();
});
