const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const PAGE_TOKEN = process.env.PAGE_TOKEN;
const VERIFY_TOKEN = "verify123";

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const event = entry.messaging[0];
      if (event.message && event.message.text) {
        const senderId = event.sender.id;
        const text = event.message.text.toLowerCase();

        if (text.includes("points")) {
          sendMessage(senderId, "Naa kay 100 points 🎉");
        } else {
          sendMessage(senderId, "I-mention ko ug naay 'points'");
        }
      }
    });
  }
  res.sendStatus(200);
});

function sendMessage(senderId, text) {
  fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_TOKEN}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text }
    })
  });
}

app.listen(3000);