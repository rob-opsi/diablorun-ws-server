const tmi = require('tmi.js');
const api = require('./api');

let _tmiClient;

async function getTmiClient(channels=[], reconnect=false) {
  if (_tmiClient) {
    if (!reconnect) {
      return _tmiClient;
    }

    try {
      await _tmiClient.disconnect();
    } catch (err) {}
  }

  _tmiClient = new tmi.client({
    identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_BOT_PASSWORD
    },
    channels,
    connection: {
      reconnect: true
    }
  });

  await _tmiClient.connect();
  return _tmiClient;
}

async function sendTwitchMessages(messages) {
  const tmiClient = await getTmiClient();

  await Promise.all(messages.map(({ channel, message, timeout }) =>
    new Promise(done => {
      setTimeout(async () => {
        await tmiClient.say(channel, message);
        done();
      }, timeout || 0)
    })
  ));
}

async function runTwitchBot() {
  try {
    const { commands, channels } = await api.get('/twitch-bot');
    const tmiClient = await getTmiClient(channels, true);

    tmiClient.on('message', async (channel, tags, message) => {
      if (commands.includes(message.split(' ')[0])) {
        try {
          const messages = await api.post('/webhooks/twitch-command', { channel, message, from: tags.username });
          await sendTwitchMessages(messages);
        } catch (err) {}
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = { sendTwitchMessages, runTwitchBot };
