// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

// Route: GET
// Path: /posts/:id/comments
// Get all comments for a given post
app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.send(posts[id] || []);
});

// Route: POST
// Path: /posts/:id/comments
// Create a comment for a given post
app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Get all comments for a given post
  const comments = posts[id] || [];

  // Create a new comment
  const comment = {
    id: Math.random().toString(36).substring(2),
    content,
    status: 'pending',
  };

  // Add new comment to comments array
  comments.push(comment);

  // Update comments array
  posts[id] = comments;

  // Send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...comment,
      postId: id,
    },
  });

  res.status(201).send(comments);
});

// Route: POST
// Path: /events
// Receive events from event bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, status } = data;

    // Get all comments for a given post
    const comments = posts[postId];

    // Find comment
    const comment = comments.find((c) => c.id === id);

    // Update comment status
    comment.status = status;

    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...comment,
        postId,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});