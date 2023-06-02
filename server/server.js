require('dotenv').config();
const express = require('express');
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Client, Intents, Collection } = require('discord.js');

const app = express();
app.use(require('body-parser').json({ limit: "10kb" })).use(require('body-parser').urlencoded({ extended: true })).use(require('cors')());
app.use(require('express-session')({
  secret: randomBytes(36).toString('hex'),
  cookie: { secure: true, maxAge: 60000 },
  resave: true,
  saveUninitialized: false
}));

const { port, database } = require('./params/params');
app.set('port', port || 8080);

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Database --> Connected')).catch(e => console.error('Database -->', e));

fs.readdirSync(path.join(__dirname, 'routes')).filter(file => file.endsWith('.js')).forEach(file => app.use('/v1/api', require(path.join(__dirname, 'routes', file))));

app.listen(app.get('port'), () => console.log('Server --> Connected to PORT ' + app.get('port')));

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Collection();

fs.readdirSync('./bot/events').forEach(file => require(path.join('./bot/events', file))(client));
fs.readdirSync('./bot/commands').forEach(file => client.commands.set(file.name, file));

client.login('');
