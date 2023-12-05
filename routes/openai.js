var express = require('express');
var router = express.Router();
var openaiAPI = require('../services/openaiAPI');

router.use(express.json()); // Middleware for parsing JSON bodies

router.post('/askAssistant', async function(req, res, next) {
  const content = req.body.content;
  const assistant_id = req.body.assistant_id;
  const thread_id = req.body.thread_id || null;
  const [response, thread] = await openaiAPI.askAssistant(content, assistant_id, thread_id);
  res.send({response, thread});
});

module.exports = router;
