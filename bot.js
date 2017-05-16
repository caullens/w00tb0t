const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
var config;
fs.readFile('config.json', (err, data) => {
  if(err) {
    console.log(err);
    return;
  }
  if(!data) {
    console.log('No data');
    return;
  }
  config = JSON.parse(data);

  client.login(config.token);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
  if(msg.content === 'ping') msg.reply('pong');
});
