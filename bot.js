const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const Commands = require('./commands.js');
var commands = new Commands();

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
  commands.create('party', 'Party time dudes!', party.bind(this));
});

client.on('message', msg => {
  if(!(msg.content[0] === '!')) return;
  console.log("Command detected");
  var args = msg.content.slice(1).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(' ');
  var response = commands.execute(args);
  msg.channel.send(response);
});

function party(args) {
    var online = [];
    client.users.forEach(user => {
      if(user.presence.status === 'online') online.push(user);
    });
    var choice = Math.floor(Math.random()*online.length);
    while(online[choice].bot) {
      choice = Math.floor(Math.random()*online.length);
    }
    return `It's party time and everyone execpt ${online[choice].username} is invited!`;
}
